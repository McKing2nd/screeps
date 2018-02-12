import { MyCreep } from "./CreepRole";

const roleUpgrader = require("role.upgrader");

export class Harvester extends MyCreep { 
    
    run(creep: MyCreep): void {
        if (creep.isWorking()) {
            var structure:OwnedStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });
            if (structure === undefined && creep.room.storage != undefined ) {
                structure = creep.room.storage;
            }
            
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};