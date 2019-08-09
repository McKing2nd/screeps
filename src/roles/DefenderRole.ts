import { MyCreep } from './CreepRole';

export class Defender extends MyCreep {
	run(): void {
		if (this.creep.room.name === this.creep.memory.target || this.creep.room.memory.wait) {
			let target: Creep | Structure | null= this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
			if (!target) {
				target = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
			}
			if (target) {
				if (this.creep.attack(target) !== OK) {
					this.creep.moveTo(target);
				}
			} else {
				const flag: Flag | null = this.creep.pos.findClosestByRange(FIND_FLAGS, {
					filter: (f) => f.color === COLOR_WHITE
				});
				if (flag) this.creep.moveTo(flag);	
			}
		} else {
			this.moveToExitFor(this.target);
		}
	}
}
