import { MyCreep } from "./CreepRole";
import { Harvester } from "./HarvesterCreepRole";

export class LongDistanceHarvester extends MyCreep {
    public run(): void {
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
                    const site: ConstructionSite = this.creep.pos.findClosestByPath(targets);
                    if (this.creep.build(site) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(site, { visualizePathStyle: { stroke: "#ffffff" } });
                    }
                } else {
                    const exit = this.creep.room.findExitTo(this.home);
                    this.creep.moveTo(this.creep.pos.findClosestByRange(exit as ExitConstant));
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
                if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            } else {
                const exit = this.creep.room.findExitTo(this.creep.memory.target);
                this.creep.moveTo(this.creep.pos.findClosestByPath(exit as ExitConstant));
            }
        }
    }
}
