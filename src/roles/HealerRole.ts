import { MyCreep } from "./CreepRole";

export class Healer extends MyCreep {
     public run(): void {
        if (this.creep.room.name === this.target || this.creep.room.memory.wait) {
            const target = this.creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (c) => (c.hits < c.hitsMax)
            });
            if (target !== undefined) {
                if (this.creep.heal(target) !== OK) {
                    this.creep.moveTo(target);
                }
            } else {
               const flag = this.creep.pos.findClosestByRange(FIND_FLAGS, {
                    filter: (f) => f.color === COLOR_WHITE
                });
               if (flag !== undefined) {
                    this.creep.moveTo(flag);
                }
            }
        } else {
            const exit = this.creep.room.findExitTo(this.target);
            this.creep.moveTo(this.creep.pos.findClosestByPath(exit as ExitConstant));
        }
    }
}
