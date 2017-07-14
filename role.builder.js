var roleHarvester = require('role.harvester');
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.role =='builder' && creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        } else {
            if(creep.isWorking()) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    target = creep.pos.findClosestByPath(targets);
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    roleHarvester.run(creep);
                }
            } else {
                creep.getEnergy();
            }
        }
    }
}