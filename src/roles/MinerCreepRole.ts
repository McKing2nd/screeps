import { MyCreep } from "./CreepRole";

export class Miner extends MyCreep {
    public run(): void {
        const source: Source | null = Game.getObjectById(this.creep.memory.sourceID);
        // TODO: Store in memory
        if (!source) { console.log("What am I doing here?"); return; }

        const container: RoomObject = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s: OwnedStructure) => s.structureType === STRUCTURE_CONTAINER
        })[0];

        if (this.creep.pos.isEqualTo(container)) {
            this.creep.harvest(source);
        } else {
            this.creep.moveTo(container);
        }
    }
}
