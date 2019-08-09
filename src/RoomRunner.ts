export class RoomRunner {

	private room: Room;

	constructor(room: Room) {
		this.room = room;
	}

	run = () => {
	 	this.runTowers();
	}

	private runTowers(): void {
		const towers = this.getTowers();
		for (const tower of towers) {
			if (!tower.defend() && !tower.healClosest()) {
				tower.repairClosest();
			} else {
				console.log('We are under attack!');
			}
		}
	}

	getTowers(): StructureTower[] {
		return this.room.find<StructureTower>(FIND_STRUCTURES, {
			filter: (s) => s.structureType === STRUCTURE_TOWER
		});
	}
}
