import { MyCreep } from './CreepRole';

export class Claimer extends MyCreep {

	run(): void {
		if (this.creep.room.name !== this.target) {
			this.moveToExitFor(this.target);
		} else {
			if (this.creep.reserveController(this.creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.creep.room.controller as StructureController);
			} else if ( this.creep.reserveController(this.creep.room.controller as StructureController) !== OK ) {
				this.creep.attackController(this.creep.room.controller as StructureController);
			}
		}
	}
}
