import { profile } from 'profiler/decorator';

import { MyCreep } from 'roles/CreepRole';

@profile
export class RoomRunner {

	private room: Room;
	private harvesters: Creep[];
	private roles: string[];
	private creeps: {[k: string]: Creep[]} = {};

	constructor(room: Room) {
		this.room = room;
		const creepsInRoom = room.find(FIND_MY_CREEPS);
			
		MyCreep.ALL_ROLES.forEach(role => {
			this.creeps[role] = _.filter(creepsInRoom, (creep) => creep.memory.role === role);
		});
	}

	run() {
	 	this.runTowers();
	}

	private runTowers(): void {
		const towers = this.getTowers();
		for (const tower of towers) {
			if (!tower.defend() && !tower.healClosest()) {
				tower.repairClosest();
			} else {
			}
		}
	}

	getTowers(): StructureTower[] {
		return this.room.find<StructureTower>(FIND_STRUCTURES, {
			filter: (s) => s.structureType === STRUCTURE_TOWER
		});
	}

	getCreepsWithRole(role: string): Creep[] {
		console.log('Number of: ', role, ' = ', this.creeps[role].length);
		return this.creeps[role];
	}

}
