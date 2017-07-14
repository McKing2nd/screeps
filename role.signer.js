module.exports = {

     /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.room.controller) {
            if(creep.signController(creep.room.controller, "...") == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            } else {
                console.log('Signing off!');
            } 
            
        }
    }
};
