import { MyCreep } from "./CreepRole";

export class Defender extends MyCreep {
    public run(): void {
        if (this.creep.room.name === this.creep.memory.target || this.creep.room.memory.wait) {
            const target: Creep = this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target !== undefined) {
                if (this.creep.attack(target) !== OK) {
                    this.creep.moveTo(target);
                }
            } else {
                const flag: Flag = this.creep.pos.findClosestByRange(FIND_FLAGS, {
                    filter: (f) => f.color === COLOR_WHITE
                });
                if (flag !== undefined) {
                    this.creep.moveTo(flag);
                }
            }
        } else {
            const exit: ScreepsReturnCode | ExitConstant  = this.creep.room.findExitTo(this.creep.memory.target);
            this.creep.moveTo(this.creep.pos.findClosestByPath(exit as ExitConstant));
        }
    }
}
