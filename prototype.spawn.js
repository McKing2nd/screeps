StructureSpawn.prototype.createCustomCreep = function (energy, roleName, target) {
    var numberOfParts = Math.floor(energy / 200);
    var body = [];

    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }

    return this.createCreep(body, undefined, { role: roleName, working: false, target: target });
}

// create a new function for StructureSpawn
StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex) {
        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }
        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        energy -= 150 * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / 150);
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < (numberOfParts + numberOfWorkParts); i++) {
            body.push(MOVE);
        }

        // create creep with the created body
        return this.createCreep(body, undefined, {
            role: 'longDistanceHarvester',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        });
    };

StructureSpawn.prototype.createClaimer = function (target) {
    return this.createCreep([CLAIM, CLAIM, MOVE, MOVE], undefined, { role: 'claimer', target: target });
}

StructureSpawn.prototype.createMiner = function (energy, sourceID) {
    var body = [MOVE];
    var numberOfWorkParts = Math.min(Math.floor((energy - 50) / 100), 5);
    for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
    }
    return this.createCreep(body, undefined, { role: 'miner', sourceID: sourceID });
}

StructureSpawn.prototype.createCarrier = function (energy, objectID) {
    var body = [];
    var numberOfParts = Math.floor(energy / 150);
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }

    // create creep with the created body
    return this.createCreep(body, undefined, {
        role: 'carrier',
        containerID: objectID,
        working: false
    });
}

StructureSpawn.prototype.createDefender = function (energy, target) {
    var body = [];
    var numberOfParts = Math.floor(energy / 200);
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
    return this.createCreep(body, undefined, {
        role: 'defender',
        target: target,
        working: false
    });
}

StructureSpawn.prototype.createHealer = function (energy, target) {
    var body = [];
    var numberOfParts = Math.floor(energy / 360);
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
    return this.createCreep(body, undefined, {
        role: 'healer',
        target: target,
        working: false
    });
}

StructureSpawn.prototype.createUpgrader = function (energy, target) {
    if (energy >= 450) {
        var body = [];
        var numberOfParts = Math.floor(energy / 450);
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
    return this.createCreep(body, undefined, {
        role: 'upgrader',
        target: target,
        working: false
    });
}

StructureSpawn.prototype.init = function () {
    this.memory.builders = 1;
}