
module.exports = {
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceID);
        // TODO: Store in memory
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];
        
        if(creep.pos.isEqualTo(container)){
            creep.harvest(source);
        } else {
            creep.moveTo(container);
        }
    }
};