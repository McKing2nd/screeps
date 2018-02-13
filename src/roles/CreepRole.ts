import { Builder } from "./BuilderRole";
import { Carrier } from "./CarrierRole";
import { Claimer } from "./ClaimerRole";
import { Defender } from "./DefenderRole";
import { Harvester } from "./HarvesterCreepRole";
import { Healer } from "./HealerRole";
import { LongDistanceHarvester } from "./LongDistanceHarvester";
import { Miner } from "./MinerCreepRole";

export abstract class MyCreep {

    protected creep: Creep;
    protected exit: ScreepsReturnCode | ExitConstant | undefined;
    protected home: string;
    protected containerID: string;
    protected target: string;

    public static newFor(creep: Creep): MyCreep | null {
        let myCreep: MyCreep | null = null;

        switch (creep.memory.role) {
            case "Builder":
                myCreep = new Builder(creep);
                break;
            case "Carrier":
                myCreep = new Carrier(creep);
                break;
            case "Claimer":
                myCreep = new Claimer(creep);
                break;
            case "Defender":
                myCreep = new Defender(creep);
                break;
            case "Harvester":
                myCreep = new Harvester(creep);
                break;
            case "Healer":
                myCreep = new Healer(creep);
                break;
            case "LongDistanceHarvester":
                myCreep = new LongDistanceHarvester(creep);
                break;
            case "Miner":
                myCreep = new Miner(creep);
                break;
        }
        return myCreep;
    }

    public constructor(creep: Creep) {
        this.creep = creep;
        this.exit = creep.memory.exit;
        this.home = creep.memory.home;
        this.containerID = creep.memory.containerID;
        this.target = creep.memory.target;
    }

    protected getEnergy(): void {
        const container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER)
                && s.store[RESOURCE_ENERGY] > 100
        });
        const droppedEnergy = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
                { filter: (e) => e.amount > 100 });

        if (droppedEnergy !== undefined) {
            if (this.creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(droppedEnergy);
            }
        } else if (container !== undefined) {
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

    public isWorking(): boolean {
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
