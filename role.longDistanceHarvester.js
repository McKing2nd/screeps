var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        if (creep.isWorking()) {
            if (creep.room.name == creep.memory.home) {
                roleHarvester.run(creep);
            } else {
                // find exit to home room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // if in target room
            if (creep.room.name == creep.memory.target) {
                // find source
                if(creep.memory.sourceIndex < 0) {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                } else {
                    var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
                }
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
    }
};