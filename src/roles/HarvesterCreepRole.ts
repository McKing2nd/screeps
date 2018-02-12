import { MyCreep } from "./CreepRole";

export class Harvester extends MyCreep {
    public run(): void {
        if (this.isWorking()) {
            let structure: OwnedStructure = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType === STRUCTURE_SPAWN
                             || s.structureType === STRUCTURE_EXTENSION
                             || s.structureType === STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });
            if (structure === undefined && this.creep.room.storage !== undefined ) {
                structure = this.creep.room.storage;
            }

            if (structure !== undefined) {
                if (this.creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(structure);
                }
            } else {
                // TODO: FIX This
                // roleUpgrader.run(creep);
            }
        } else {
            const source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        }
    }
}
