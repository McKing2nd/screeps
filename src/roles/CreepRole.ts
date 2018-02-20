export abstract class MyCreep {

    protected creep: Creep;
    protected exit?: ScreepsReturnCode | ExitConstant;
    protected home: string;
    protected containerID?: string;
    protected target: string;
    protected currentState: State;

    public constructor(creep: Creep) {
        this.creep = creep;
        this.exit = creep.memory.exit;
        this.home = creep.memory.home;
        this.containerID = creep.memory.containerID;
        this.target = creep.memory.target;
        this.currentState = STATE_WORKING;
    }

    protected getEnergy(): void {
        const container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER)
                && s.store[RESOURCE_ENERGY] > 100
        });
        const droppedEnergy = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
                { filter: (e) => e.amount > 100 });

        if (droppedEnergy) {
            if (this.creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(droppedEnergy);
            }
        } else if (container) {
            if (this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(container);
            }
        } else {
            const source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        }
    }

    protected isWorking(): boolean {
        if (this.creep.memory.working && this.creep.carry.energy === 0) {
            this.creep.memory.working = false;
        } else if (!this.creep.memory.working && this.creep.carry.energy === this.creep.carryCapacity) {
            this.creep.memory.working = true;
        }
        return this.creep.memory.working;
    }

    public work(): void {
        this.run();
    }

    public abstract run(): void;
}
