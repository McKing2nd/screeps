import { ScreepRoleFactory } from "./ScreepRoleFactory";

StructureSpawn.prototype.createCustomCreep = function(energy: number, role: string, target: string) {
    const numberOfParts = Math.floor(energy / 200);
    const body = [];

    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    const memory: CreepMemory = { home: this.memory.home, role, working: false, target };
    return this.spawnCreep(body as BodyPartConstant[], role + Game.time, { memory } );
};

StructureSpawn.prototype.createLongDistanceHarvester =
    function(energy: number, numberOfWorkParts: number, home: string, target: string, sourceIndex: number) {
        const body: BodyPartConstant[] = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }
        energy -= 150 * numberOfWorkParts;

        const numberOfParts = Math.floor(energy / 150);
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < (numberOfParts + numberOfWorkParts); i++) {
            body.push(MOVE);
        }
        const role: string = "longDistanceHarvester";
        const memory: CreepMemory = {
            home: this.memory.home,
            role,
            sourceIndex,
            target,
            working: false };
        return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.createClaimer = function(target: string) {
    const role: string = "claimer";
    const body: BodyPartConstant[] = [CLAIM, CLAIM, MOVE, MOVE];
    const memory: CreepMemory = {
        home: this.memory.home,
        role,
        target,
        working: false };
    return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.createMiner = function(energy: number, sourceID: string) {
    const role: string = "miner";
    const body: BodyPartConstant[] = [MOVE];
    const memory: CreepMemory = {
        home: this.memory.home,
        role,
        sourceID,
        target: this.memory.home,
        working: false
    };

    const numberOfWorkParts: number = Math.min(Math.floor((energy - 50) / 100), 5);
    for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
    }
    return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.createCarrier = function(energy: number, containerID: string, home: string, target: string) {
    const body: BodyPartConstant[] = [];
    const role: string = "carrier";
    const memory: CreepMemory = {
        containerID,
        home: this.memory.home,
        role,
        target: this.memory.home,
        working: false
    };
    energy = Math.min(energy, 750);
    const numberOfParts = Math.floor(energy / 150);
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }

    return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.createDefender = function(energy: number, target: string) {
    const body: BodyPartConstant[] = [];
    const role: string = "defender";
    const memory: CreepMemory = {
        home: this.memory.home,
        role,
        target,
        working: false
    };
    const numberOfParts = Math.floor(energy / 200);
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(TOUGH);
    }
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(MOVE);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(ATTACK);
    }

    // create creep with the created body
    return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.createHealer = function(energy: number, target: string) {
    const body: BodyPartConstant[] = [];
    const role: string = "healer";
    const memory: CreepMemory = {
        home: this.memory.home,
        role,
        target,
        working: false
    };
    const numberOfParts = Math.floor(energy / 360);
    for (let i = 0; i < numberOfParts; i++) {
        body.push(TOUGH);
    }
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(MOVE);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(HEAL);
    }

    // create creep with the created body
    return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.createUpgrader = function(energy, target) {
    const body: BodyPartConstant[] = [];
    const role: string = "upgrader";
    const memory: CreepMemory = {
        home: this.memory.home,
        role,
        target,
        working: false
    };
    energy = Math.min(energy, 2000);
    if (energy >= 450) {
        const numberOfParts = Math.floor(energy / 450);
        for (let i = 0; i < numberOfParts * 3; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
    } else {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }

    // create creep with the created body
    return this.spawnCreep(body, role + Game.time, { memory });
};

StructureSpawn.prototype.init = function() {
    this.memory.home = this.room.name;
    this.memory.upgraders = 2;
    this.memory.builders = 2;
    this.memory.repairers =  0;
    this.memory.wallrepairers = 0;
    this.memory.externalRooms = [];
    this.memory.initialized = true;
};
