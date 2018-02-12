 
export abstract class MyCreep extends Creep  {


    getEnergy(): void  {
        let container = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 100 });
        let droppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: e => e.amount > 100 });

        if(droppedEnergy != undefined) {
            if (this.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                this.moveTo(droppedEnergy);
            }
        } else if (container != undefined) {
            if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(container);
            }
        } else {
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    }

    isWorking(): boolean {
        if (this.memory.working && this.carry.energy == 0) {
            this.memory.working = false;
        }  else if (!this.memory.working && this.carry.energy == this.carryCapacity) {
            this.memory.working = true;
        }
        return this.memory.working;
    }

    work (): void {
        this.run(this);
    }

    run(creep: MyCreep): void {}
}