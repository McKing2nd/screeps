import { MyCreep } from './CreepRole'

export class Defender extends MyCreep {
    run(creep: MyCreep): void {
        if (creep.room.name == creep.memory.target || creep.room.memory.wait) {
            var target: Creep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                if (creep.attack(target) != OK) {
                    creep.moveTo(target);
                }
            } else {
                var flag: Flag = creep.pos.findClosestByRange(FIND_FLAGS, {
                    filter: (f) => f.color == COLOR_WHITE
                });
                if (flag != undefined) {
                    creep.moveTo(flag);
                }
            }
        } else {
            var exit:  ScreepsReturnCode | ExitConstant  = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit as ExitConstant));
        }
    }
};