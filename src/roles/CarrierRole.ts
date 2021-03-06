import { MyCreep } from './CreepRole';

export class Carrier extends MyCreep {
	run(): void {
		if (this.isWorking()) {
			if (this.exit) {
				this.exit = undefined;
			}
			if (this.creep.room.name === this.home) {
				let structure: OwnedStructure|null = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
					filter: (s) => (s.structureType === STRUCTURE_SPAWN
						|| s.structureType === STRUCTURE_EXTENSION
						|| s.structureType === STRUCTURE_TOWER)
						&& s.energy < s.energyCapacity
				});

				if (!structure && this.creep.room.storage) {
					structure = this.creep.room.storage as StructureStorage;
				}
				if ( structure && this.creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					// move towards it
					this.creep.moveTo(structure);
				}
			} else {
				this.moveToExitFor(this.home);
			}

		} else {
			if (this.creep.room.name === this.target) {
				if (this.exit) {
					this.exit = undefined;
				}
				let container: StructureContainer | StructureStorage | undefined | null =
					Game.getObjectById(this.containerID);
				if (this.containerID
					&& container
					&& container.store[RESOURCE_ENERGY] > 200) {
					container = Game.getObjectById(this.containerID) as StructureContainer;
				} else {
					container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
						filter: (s) => s.structureType === STRUCTURE_CONTAINER
							&& s.store[RESOURCE_ENERGY] > 200 }) as StructureContainer;
				}

				if (!container)	container = this.creep.room.storage;
				if (container) {
					if (this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
						this.creep.moveTo(container);
					}
				}
			} else {
				this.moveToExitFor(this.target);
			}
		}
	}

	private getContainer(): StructureContainer {
		return Game.getObjectById(this.containerID) as StructureContainer;
	}
}
