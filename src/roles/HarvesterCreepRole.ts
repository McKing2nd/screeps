import { MyCreep } from './CreepRole';
import { Upgrader } from './UpgraderRole';

export class Harvester extends MyCreep {
	run(): void {
		if (this.isWorking()) {
			let structure: OwnedStructure | null = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
				filter: (s) => (s.structureType === STRUCTURE_SPAWN
								|| s.structureType === STRUCTURE_EXTENSION
								|| s.structureType === STRUCTURE_TOWER)
								&& s.energy < s.energyCapacity
			});
			if (!structure && this.creep.room.storage) {
				structure = this.creep.room.storage;
			}

			if (structure) {
				if (this.creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(structure);
				}
			} else {
				new Upgrader(this.creep).run();
			}
		} else {
			const source: Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if (source && this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(source);
			}
		}
	}
}
