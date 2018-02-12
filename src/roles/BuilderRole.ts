import { MyCreep } from './CreepRole'
var roleHarvester = require('role.harvester');
export class Builder extends MyCreep {
    
    run(creep: MyCreep): void {

        if(creep.memory.role =='builder' && creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit: Room = creep.room.findExitTo<Room>(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        } else {
            if(creep.isWorking()) {
                var targets: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    var target: ConstructionSite = creep.pos.findClosestByPath(targets);
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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