import { MyCreep } from './MyCreep'

export class Miner extends MyCreep {
    run(creep: MyCreep): void {
        var source: Mineral | null = Game.getObjectById(creep.memory.sourceID);
        // TODO: Store in memory
        if (source == null) { console.log("What am I doing here?"); return;}
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter s => s.structureType == STRUCTURE_CONTAINER
        })[0];
        
        if(creep.pos.isEqualTo(container)){
            creep.harvest(source);
        } else {
            creep.moveTo(container);
        }
    }
};