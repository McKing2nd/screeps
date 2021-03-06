export abstract class MyCreep {

	static readonly ROLE_HARVESTER = 'harvester';
	static readonly ROLE_UPGRADER = 'upgrader';
	static readonly ROLE_BUILDER = 'builder';
	static readonly ROLE_REPAIRER = 'repairer';
	static readonly ROLE_WALLREPAIRER = 'wallrepairer';
	static readonly ROLE_MINER = 'miner';
	static readonly ROLE_CARRIER = 'carrier';
	static readonly ROLE_CLAIMER = 'claimer';
	static readonly ROLE_HEALER = 'healer';
	static readonly ROLE_DEFENDER = 'defender';
	static readonly ROLE_LONGDISTANCEHARVESTER = 'longDistanceHarvester';

	static readonly ALL_ROLES = [
		MyCreep.ROLE_HARVESTER,
		MyCreep.ROLE_UPGRADER,
		MyCreep.ROLE_BUILDER,
		MyCreep.ROLE_REPAIRER,
		MyCreep.ROLE_WALLREPAIRER,
		MyCreep.ROLE_MINER,
		MyCreep.ROLE_CARRIER,
		MyCreep.ROLE_CLAIMER,
		MyCreep.ROLE_HEALER,
		MyCreep.ROLE_DEFENDER,
		MyCreep.ROLE_LONGDISTANCEHARVESTER 
	];

	protected creep: Creep;
	protected exit?: ScreepsReturnCode | ExitConstant;
	protected home: string;
	protected containerID?: string;
	protected target: string;

	constructor(creep: Creep) {
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

		if (droppedEnergy) {
			if (this.creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(droppedEnergy);
			}
		} else if (container) {
			if (this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(container);
			}
		} else {
			const source: Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if (source === null) { return; }
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

	work(): void {
		this.run();
	}

	protected moveToExitFor(targetRoom: string): void {
		if(!this.exit) this.exit = this.creep.room.findExitTo(targetRoom);
		const exitPos =  this.creep.pos.findClosestByPath(this.exit as ExitConstant);
		if(exitPos !== null) this.creep.moveTo(exitPos); 
	}

	abstract run(): void;
}
