import { MyCreep } from './CreepRole';
import { Harvester } from './HarvesterCreepRole';

export class LongDistanceHarvester extends MyCreep {
	run(): void {
		if (this.isWorking()) {
			if (this.creep.room.name === this.home) {
				 new Harvester(this.creep).run();
			} else {
				const targets: ConstructionSite[] = this.creep.room.find(FIND_CONSTRUCTION_SITES);
				const structure = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (s) => s.hits < s.hitsMax - (s.hitsMax * .1) && s.structureType !== STRUCTURE_WALL});
				if (structure) {
					if (this.creep.repair(structure) === ERR_NOT_IN_RANGE) {
						this.creep.moveTo(structure);
					}
				} else if (targets.length) {
					const site: ConstructionSite | null = this.creep.pos.findClosestByPath(targets);
					if (site && this.creep.build(site) === ERR_NOT_IN_RANGE) {
						this.creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' } });
					}
				} else {
					this.moveToExitFor(this.home);
				}
			}
		} else {
			if (this.creep.room.name === this.target) {
				let source;
				if (this.creep.memory.sourceIndex !== undefined && this.creep.memory.sourceIndex >= 0) {
					source = this.creep.room.find(FIND_SOURCES)[this.creep.memory.sourceIndex];
				} else {
					source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
				}
				if (source && this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(source);
				}
			} else {
				this.moveToExitFor(this.target);
			}
		}
	}
}
