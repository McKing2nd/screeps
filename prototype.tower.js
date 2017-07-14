StructureTower.prototype.defend = function() {
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target != undefined) {
        this.attack(target);
        return true;
    }
    return false;
}

StructureTower.prototype.repairClosest = function() {
    var structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.hits < (s.hitsMax - (s.hitsMax * .1)) && s.structureType != STRUCTURE_WALL
    });

    if (structure != undefined) {
        this.repair(structure);
        return true;
    }
    return false;
}

StructureTower.prototype.healClosest = function() {
   var target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => (c.hits < c.hitsMax)
            });
    if (target != undefined) {
        this.heal(target);
        return true;
    }
    return false;
}