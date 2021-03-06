import { MyCreep } from './CreepRole';

export class Healer extends MyCreep {
	 run(): void {
		if (this.creep.room.name === this.target || this.creep.room.memory.wait) {
			const target = this.creep.pos.findClosestByPath(FIND_MY_CREEPS, {
				filter: (c) => (c.hits < c.hitsMax)
			});
			if (target) {
				if (this.creep.heal(target) !== OK) {
					this.creep.moveTo(target);
				}
			} else {
			   const flag = this.creep.pos.findClosestByRange(FIND_FLAGS, {
					filter: (f) => f.color === COLOR_WHITE
				});
			   if (flag) {
					this.creep.moveTo(flag);
				}
			}
		} else {
			this.moveToExitFor(this.target);
		}
	}
}
