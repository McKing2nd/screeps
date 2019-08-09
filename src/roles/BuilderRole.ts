import { MyCreep } from './CreepRole';
import { Upgrader } from './UpgraderRole';

export class Builder extends MyCreep {

	run(): void {

		if (this.creep.memory.role === MyCreep.ROLE_BUILDER &&
			this.creep.memory.target &&
			this.creep.room.name !== this.creep.memory.target) {
				this.moveToExitFor(this.target);		
		} else {
			if (this.isWorking()) {
				const targets: ConstructionSite[] = this.creep.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length) {
					const target: ConstructionSite | null = this.creep.pos.findClosestByPath(targets);
					if (target !== null && this.creep.build(target) === ERR_NOT_IN_RANGE) {
						this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
					}
				} else {
				   new Upgrader(this.creep).run();
				}
			} else {
				this.getEnergy();
			}
		}
	}
}
