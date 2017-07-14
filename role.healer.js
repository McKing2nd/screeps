
module.exports = {
     run: function(creep) {
        if (creep.room.name == creep.memory.target || creep.room.memory.wait) {
            var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (c) => (c.hits < c.hitsMax)
            });
            if (target != undefined) {
                if(creep.heal(target) != OK) {
                    creep.moveTo(target);
                }
            } else {
               var flag = creep.pos.findClosestByRange(FIND_FLAGS, {
                    filter: (f) => f.color == COLOR_WHITE
                });
                if(flag != undefined) {
                    creep.moveTo(flag);
                }
            }
        } else {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
    }
};