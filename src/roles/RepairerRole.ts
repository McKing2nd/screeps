import { Builder } from './BuilderRole';
import { MyCreep } from './CreepRole';

export class Repairer extends MyCreep {

	run(): void {
		if (this.creep.memory.role === 'repairer'
			&& this.creep.memory.target !== undefined
			&& this.creep.room.name !== this.creep.memory.target) {
				this.moveToExitFor(this.target);
		} else {
			if (this.creep.memory.working && this.creep.carry.energy === 0) {
				this.creep.memory.working = false;
			} else if (!this.isWorking() && this.creep.carry.energy === this.creep.carryCapacity) {
				this.creep.memory.working = true;
			}
			if (this.isWorking()) {
				const structure = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
				});
				if (structure && structure !== undefined) {
					if (this.creep.repair(structure) === ERR_NOT_IN_RANGE) {
						this.creep.moveTo(structure);
					}
				} else {
					new Builder(this.creep).run();
				}
			} else {
			   this.getEnergy();
			}
		}
	}
}
