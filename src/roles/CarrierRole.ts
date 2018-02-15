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

                if (!structure && this.creep.room.storage) {
                    structure = this.creep.room.storage as StructureStorage;
                }

                if (structure) {
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

                if (!container) {
                    container = this.creep.room.storage;
                }
                if (container) {
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
        return Game.getObjectById(this.containerID) as StructureContainer;
    }
}
