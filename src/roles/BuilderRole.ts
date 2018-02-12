import { MyCreep } from "./CreepRole";
const roleHarvester = require("role.harvester");

export class Builder extends MyCreep {

    public run(creep: MyCreep): void {

        if (creep.memory.role === "builder" &&
            creep.memory.target !== undefined &&
            creep.room.name !== creep.memory.target) {
                const exit: ScreepsReturnCode | ExitConstant = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByPath(exit as ExitConstant));
        } else {
            if (creep.isWorking()) {
                const targets: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    const target: ConstructionSite = creep.pos.findClosestByPath(targets);
                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
                    }
                } else {
                    roleHarvester.run(creep);
                }
            } else {
                creep.getEnergy();
            }
        }
    }
}
