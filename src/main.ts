import { MyCreep } from "./roles/CreepRole";
import { ScreepRoleFactory } from "./ScreepRoleFactory";
import { ErrorMapper } from "./utils/ErrorMapper";

import "./SpawnPrototype";
import "./TowerPrototype";

const SPAWN_NAME = "Spawn1";
const HOME = Game.spawns[SPAWN_NAME].memory.home;

export const loop = ErrorMapper.wrapLoop(() => {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory:", name);
        }
    }

    const spawn = Game.spawns[SPAWN_NAME];

    if (spawn.memory.initialized === undefined) {
        spawn.init();
    }

    const towers = spawn.room.find<StructureTower>(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER
    });

    for (const tower of towers) {
        if (!tower.defend() && !tower.healClosest()) {
            tower.repairClosest();
        } else {
            console.log("We are under attack!");
        }
    }

    const creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

    const harvesters = _.filter(creepsInRoom, (creep) => creep.memory.role === "harvester");
    const upgraders = _.filter(creepsInRoom, (creep) => creep.memory.role === "upgrader");
    const builders = _.filter(creepsInRoom, (creep) => creep.memory.role === "builder");
    const repairers = _.filter(creepsInRoom, (creep) => creep.memory.role === "repairer");
    const wallrepairers = _.filter(creepsInRoom, (creep) => creep.memory.role === "wallrepairer");
    const miners = _.filter(creepsInRoom, (creep) => creep.memory.role === "miner");
    const carriers = _.filter(creepsInRoom, (creep) => creep.memory.role === "carrier");

    // const claimersE97S83 = _.filter(Game.creeps, (creep) => creep.memory.role === "claimer"
    //     && creep.memory.target === "E97S83");
    // const harvestersE97S83 = _.filter(Game.creeps, (creep) => creep.memory.role === "longDistanceHarvester"
    //     && creep.memory.target === "E97S83");

    // const harvestersE97S33 = _.filter(Game.creeps, (creep) => creep.memory.role === "longDistanceHarvester"
    //     && creep.memory.target === "E97S33");
    // const claimersE97S33 = _.filter(Game.creeps, (creep) => creep.memory.role === "claimer"
    //     && creep.memory.target === "E97S33");

    const energy = spawn.room.energyCapacityAvailable;
    let newName;

    // TODO Sources wijzigen niet, dus die kunnen we ook in memory plaatsen van de spawn
    const sources = spawn.room.find(FIND_SOURCES);

    if (harvesters.length === 0 && (miners.length === 0 || carriers.length === 0)) {
        if (miners.length > 0) {
            newName = spawn.createCarrier(spawn.room.energyAvailable, null, HOME, HOME);
        } else {
            newName = spawn.createCustomCreep(spawn.room.energyAvailable, "harvester", HOME);
        }
        console.log("** Recovery mode activated! **");
    } else {
        for (const source of sources) {
            if (!_.some(creepsInRoom, (c) => c.memory.role === "miner" && c.memory.sourceID === source.id)) {
                // TODO: Bad performance
                const containers = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                    filter: (s) => s.structureType === STRUCTURE_CONTAINER });
                if (containers.length > 0) {
                    newName = spawn.createMiner(energy, source.id);
                    break;
                }
            }
        }
    }

    if (newName === undefined) {
        if (harvesters.length < 2 && miners.length < sources.length) {
            newName = spawn.createCustomCreep(energy, "harvester", HOME);
        } else if (carriers.length < sources.length && carriers.length < miners.length) {
            for (const source of sources) {
                const containers = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                    filter: (s) => s.structureType === STRUCTURE_CONTAINER });
                if (containers.length > 0) {
                    const container = containers[0];
                    if (!_.some(creepsInRoom, (c) => c.memory.role === "carrier"
                        && c.memory.containerID === container.id)) {
                        newName = spawn.createCarrier(energy, container.id, HOME, HOME);
                        break;
                    }
                }
            }
        } else if (upgraders.length < spawn.memory.upgraders) {
            newName = spawn.createUpgrader(energy, HOME);
        // } else if (harvestersE97S83.length < 1) {
        //    newName = spawn.createLongDistanceHarvester(energy, 5, HOME, 'E97S83', 0);
        // } else if (harvestersE97S33.length < 3) {
        //    newName = spawn.createLongDistanceHarvester(energy, 5, HOME, 'E97S33', -1);
        }

        if (spawn.memory.externalRooms !== undefined
            && spawn.memory.externalRooms.length > 0
            && newName === undefined) {
            for (const room of spawn.memory.externalRooms) {
                const defenders = _.filter(Game.creeps, (creep) => creep.memory.role === "defender"
                    && creep.memory.target === room);
                const carriersExtern = _.filter(Game.creeps, (creep) => creep.memory.role === "carrier"
                    && creep.memory.target === room);
                // console.log("defenders for room " + room + ": " + defenders);
                if (defenders.length < 1) {
                    newName = spawn.createDefender(energy, room);
                    break;
                } else if (carriersExtern.length < 1) {
                    newName = spawn.createCarrier(energy, null, HOME, room);
                    break;
                }
            }
        }
        if (spawn.memory.externalRooms !== undefined
            && spawn.memory.externalRooms.length > 0
            && newName === undefined) {
            for (const room of spawn.memory.externalRooms) {
                const healers = _.filter(Game.creeps, (creep) => creep.memory.role === "healer"
                    && creep.memory.target === room);
                const claimers = _.filter(Game.creeps, (creep) => creep.memory.role === "claimer"
                    && creep.memory.target === room);
                if (healers.length < 0) {
                    newName = spawn.createHealer(energy, room);
                    break;
                } else if (claimers.length < 0) {
                    newName = spawn.createClaimer(room);
                    break;
                }
            }
        }
        if (towers.length < 1 && repairers.length < spawn.memory.repairers && newName === undefined) {
            newName = spawn.createCustomCreep(energy, "repairer", HOME);
        } else if (wallrepairers.length < spawn.memory.wallrepairers && newName === undefined) {
            newName = spawn.createCustomCreep(energy, "wallrepairer", HOME);
        } else if (builders.length < spawn.memory.builders && newName === undefined) {
            newName = spawn.createCustomCreep(energy, "builder", HOME);
        }
    }

    if (newName !== undefined && newName !== ERR_NOT_ENOUGH_ENERGY
        && newName !== ERR_BUSY && newName !== ERR_INVALID_ARGS) {
            console.log(spawn + ": Spawning new " + Game.creeps[newName].memory.role + " for room "
                + Game.creeps[newName].memory.target + ": " + newName);
    }

    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            { align: "left", opacity: 0.8 });
    }

    for (const name in Game.creeps) {
        const creep: MyCreep | null = ScreepRoleFactory.newFor(Game.creeps[name]);
        if (creep !== null) {
            creep.work();
        }
    }
});
