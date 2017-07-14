var roleBuilder = require('role.builder');

module.exports = {
    
     /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'repairer' && creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        } else {
            if (creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
            }
            else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
            }
    
            // if creep is supposed to repair something
            if (creep.memory.working) {
                // find closest structure with less than max hits
                // Exclude walls because they have way too many max hits and would keep
                // our repairers busy forever. We have to find a solution for that later.
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                });
    
                // if we find one
                if (structure != undefined) {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                } else {
                    roleBuilder.run(creep);
                }
            } else {
               creep.getEnergy();
            }
        }
    }
};