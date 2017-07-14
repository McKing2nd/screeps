Creep.prototype.roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    signer: require('role.signer'),
    repairer: require('role.repairer'),
    wallrepairer: require('role.wallrepairer'),
    claimer: require('role.claimer'),
    miner: require('role.miner'),
    carrier: require('role.carrier'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    defender: require('role.defender'),
    healer: require('role.healer')
};
    

Creep.prototype.getEnergy = function() {
    let container = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 100 });
    let droppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: e => e.amount > 100 });

    if(droppedEnergy != undefined) {
        if (this.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
            this.moveTo(droppedEnergy);
        }
    } else if (container != undefined) {
        if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
    } else {
        var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
    }
}

Creep.prototype.isWorking = function() {
    if (this.memory.working && this.carry.energy == 0) {
        this.memory.working = false;
    }  else if (!this.memory.working && this.carry.energy == this.carryCapacity) {
        this.memory.working = true;
    }
    return this.memory.working;
}

Creep.prototype.work = function() {
    this.roles[this.memory.role].run(this);
}