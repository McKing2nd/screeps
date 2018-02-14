StructureTower.prototype.defend = function() {
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        this.attack(target);
        console.log("attacking");
        return true;
    }
    return false;
};

StructureTower.prototype.repairClosest = function() {
    const structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.hits < (s.hitsMax - (s.hitsMax * .1))
            && s.structureType !== STRUCTURE_WALL
            && s.structureType !== STRUCTURE_RAMPART
    });

    if (structure) {
        this.repair(structure);
        return true;
    }
    return false;
};

StructureTower.prototype.healClosest = function() {
    const target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => (c.hits < c.hitsMax)
    });
    if (target) {
        this.heal(target);
        console.log("Healing");
        return true;
    }
    return false;
};

StructureTower.prototype.repairRampart = function() {
    const structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.hits < (s.hitsMax - (s.hitsMax * .1)) && s.structureType === STRUCTURE_RAMPART
    });

    if (structure !== undefined) {
        this.repair(structure);
        return true;
    }
    return false;
};
