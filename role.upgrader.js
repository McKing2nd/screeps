module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.isWorking()) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
           creep.getEnergy();
        }
    }
};