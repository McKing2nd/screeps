import { MyCreep } from "./CreepRole";

export class Carrier extends MyCreep {
    public run(): void {
        if (this.isWorking()) {
            if (this.exit !== undefined) {
                this.exit = undefined;
            }
            if (this.creep.room.name === this.home) {
                let structure: OwnedStructure = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_SPAWN
                        || s.structureType === STRUCTURE_EXTENSION
                        || s.structureType === STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });

                if (structure === undefined && this.creep.room.storage) {
                    structure = this.creep.room.storage as StructureStorage;
                }

                if (structure !== undefined) {
                    if (this.creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        // move towards it
                        this.creep.moveTo(structure);
                    }
                }
            } else {
                if (this.exit === undefined) {
                    this.exit = this.creep.room.findExitTo(this.home);
                }
                this.creep.moveTo(this.creep.pos.findClosestByRange(this.exit as ExitConstant));
            }

        } else {
            if (this.creep.room.name === this.target) {
                if (this.exit !== undefined) {
                    this.exit = undefined;
                }
                let container;
                if (this.containerID !== undefined
                    && this.getContainer()
                    && this.getContainer().store[RESOURCE_ENERGY] > 200) {
                    container = Game.getObjectById(this.containerID);
                } else {
                    container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.structureType === STRUCTURE_CONTAINER
                            && s.store[RESOURCE_ENERGY] > 200 });
                }

                if (container === undefined) {
                    container = this.creep.room.storage;
                }
                if (container !== undefined) {
                    if (this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                }
            } else {
                if (this.exit === undefined) {
                    this.exit = this.creep.room.findExitTo(this.target);
                }
                this.creep.moveTo(this.creep.pos.findClosestByPath(this.exit as ExitConstant));
            }
        }
    }

    private getContainer(): StructureContainer {
        return Game.getObjectById<StructureContainer>(this.containerID) as StructureContainer;
    }
}
