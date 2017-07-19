module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        if (creep.isWorking()) {
            if (creep.memory.exit != undefined) {
                creep.memory.exit = undefined;
            }
            if (creep.room.name == creep.memory.home) {
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                        || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });

                if (structure == undefined) {
                    structure = creep.room.storage;
                }

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
            } else {
                if (creep.memory.exit == undefined) {
                    creep.memory.exit = creep.room.findExitTo(creep.memory.home);
                }
                creep.moveTo(creep.pos.findClosestByRange(creep.memory.exit));
            }

        }
        // if creep is supposed to harvest energy from source
        else {
            if (creep.room.name == creep.memory.target) {
                if (creep.memory.exit != undefined) {
                    creep.memory.exit = undefined;
                }
                var container = undefined;
                if (creep.memory.containerID != undefined && Game.getObjectById(creep.memory.containerID).store[RESOURCE_ENERGY] > 200) {
                    container = Game.getObjectById(creep.memory.containerID);
                } else {
                    // find closest source
                    container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 200 });
                }

                if (container == undefined) {
                    container = creep.room.storage;
                }
                if (container != undefined) {
                    // try to harvest energy, if the source is not in range
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards the source
                        creep.moveTo(container);
                    }
                }
            }
            // if not in target room
            else {
                // find exit to target room
                if (creep.memory.exit == undefined) {
                    creep.memory.exit = creep.room.findExitTo(creep.memory.target);
                }
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(creep.memory.exit));
            }

        }
    }
};