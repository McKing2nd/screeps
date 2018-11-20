import { MyCreep } from "./roles/CreepRole";
import { RoomRunner } from "./RoomRunner";
import { ScreepRoleFactory } from "./ScreepRoleFactory";
import { ErrorMapper } from "./utils/ErrorMapper";

import "./SpawnPrototype";
import "./TowerPrototype";

export const loop = ErrorMapper.wrapLoop(() => {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory:", name);
        } else {
            const creep: MyCreep | null = ScreepRoleFactory.newFor(Game.creeps[name]);
            if (creep !== null) {
                creep.work();
            }
        }
    }
    for (const spawnName in Game.spawns) {
        const home = Game.spawns[spawnName].memory.home;

        const spawn = Game.spawns[spawnName];

        if (spawn.memory.initialized === undefined) {
            spawn.init();
        }
        // TODO Fix so we do not need an instance
        const roomRunner: RoomRunner = new RoomRunner(spawn.room);
        roomRunner.run();

        const creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

        const harvesters = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_HARVESTER);
        const upgraders = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_UPGRADER);
        const builders = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_BUILDER);
        const repairers = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_REPAIRER);
        const wallrepairers = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_WALLREPAIRER);
        const miners = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_MINER);
        const carriers = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_CARRIER);
        const defenders = _.filter(creepsInRoom, (creep) => creep.memory.role === MyCreep.ROLE_DEFENDER);

        const energy = Math.min(spawn.room.energyCapacityAvailable, 2000);
        let returnCode: ScreepsReturnCode | null = null;

        // TODO Sources wijzigen niet, dus die kunnen we ook in memory plaatsen van de spawn
        const sources = spawn.room.find(FIND_SOURCES);

        if (harvesters.length === 0 && (miners.length === 0 || carriers.length === 0)) {
            if (miners.length > 0) {
                returnCode = spawn.createCarrier(spawn.room.energyAvailable, null, home, home);
            } else {
                returnCode = spawn.createCustomCreep(spawn.room.energyAvailable, MyCreep.ROLE_HARVESTER, home);
            }
            console.log("** Recovery mode activated! **");
        } else {
            for (const source of sources) {
                if (!_.some(creepsInRoom, (c) => c.memory.role === MyCreep.ROLE_MINER
                    && c.memory.sourceID === source.id)) {
                    // TODO: Bad performance
                    const containers = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                        filter: (s) => s.structureType === STRUCTURE_CONTAINER });
                    if (containers.length > 0) {
                        returnCode = spawn.createMiner(energy, source.id);
                        break;
                    }
                }
            }
        }

        if (returnCode !== OK && spawn.room.find(FIND_HOSTILE_CREEPS).length > defenders.length) {
            returnCode = spawn.createDefender(energy, home);
        }

        if (returnCode !== OK) {
            if (harvesters.length < 2 - miners.length && miners.length < sources.length) {
                returnCode = spawn.createCustomCreep(energy, MyCreep.ROLE_HARVESTER, home);
            } else if (carriers.length < sources.length && carriers.length < miners.length) {
                for (const source of sources) {
                    const containers = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                        filter: (s) => s.structureType === STRUCTURE_CONTAINER });
                    if (containers.length > 0) {
                        const container = containers[0];
                        if (!_.some(creepsInRoom, (c) => c.memory.role === MyCreep.ROLE_CARRIER
                            && c.memory.containerID === container.id)) {
                                returnCode = spawn.createCarrier(energy, container.id, home, home);
                                break;
                        }
                    }
                }
            } else if (upgraders.length < spawn.memory.upgraders) {
                returnCode = spawn.createUpgrader(energy, home);
            }

            if (spawn.memory.externalRooms
                && spawn.memory.externalRooms.length > 0
                && returnCode !== OK) {
                for (const room of spawn.memory.externalRooms) {
                    const defendersExtern = _.filter(Game.creeps, (creep) => creep.memory.role === MyCreep.ROLE_DEFENDER
                        && creep.memory.target === room);
                    const carriersExtern = _.filter(Game.creeps, (creep) => creep.memory.role === MyCreep.ROLE_CARRIER
                        && creep.memory.target === room);
                    const harvestersExtern = _.filter(
                        Game.creeps, (creep) => creep.memory.role === MyCreep.ROLE_LONGDISTANCEHARVESTER
                        && creep.memory.target === room);
                    if (defendersExtern.length < 1) {
                        returnCode = spawn.createDefender(energy, room);
                        break;
                    } else if (harvestersExtern.length < 2 ) {
                        returnCode = spawn.createLongDistanceHarvester(energy, 5, home, room, -1);
                        break;
                    } else if (carriersExtern.length < 0) {
                        returnCode = spawn.createCarrier(energy, null, home, room);
                        break;
                    }
                }
            }
            if (spawn.memory.externalRooms
                && spawn.memory.externalRooms.length > 0
                && returnCode !== OK) {
                for (const room of spawn.memory.externalRooms) {
                    const healers = _.filter(Game.creeps, (creep) => creep.memory.role === MyCreep.ROLE_HEALER
                        && creep.memory.target === room);
                    const claimers = _.filter(Game.creeps, (creep) => creep.memory.role === MyCreep.ROLE_CLAIMER
                        && creep.memory.target === room);
                    if (healers.length < 0) {
                        returnCode = spawn.createHealer(energy, room);
                        break;
                    } else if (claimers.length < 1) {
                        returnCode = spawn.createClaimer(room);
                        break;
                    }
                }
            }
            if (returnCode !== OK && roomRunner.getTowers().length < 1 && repairers.length < spawn.memory.repairers) {
                returnCode = spawn.createCustomCreep(energy, MyCreep.ROLE_REPAIRER, home);
            } else if (returnCode !== OK && wallrepairers.length < spawn.memory.wallrepairers) {
                returnCode = spawn.createCustomCreep(energy, MyCreep.ROLE_WALLREPAIRER, home);
            } else if (returnCode !== OK && spawn.room.find(FIND_CONSTRUCTION_SITES).length !== 0
                    && builders.length < spawn.memory.builders) {
                        returnCode = spawn.createCustomCreep(energy, MyCreep.ROLE_BUILDER, home);
            }
        }

        if (spawn.spawning) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: "left", opacity: 0.8 });
        }
    }
});
