StructureTower.prototype.defend = function() {
	const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if (target) {
		this.attack(target);
		return true;
	}
	return false;
};

StructureTower.prototype.repairClosest = function() {
	const structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (s: Structure) => s.hits < (s.hitsMax - (s.hitsMax * .1))
			&& s.structureType !== STRUCTURE_WALL
			&& s.structureType !== STRUCTURE_RAMPART
	});

	if (structure) {
		this.repair(structure);
		return true;
	}
	return false;
};

StructureTower.prototype.healClosest = function() {
	const target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
		filter: (c: Creep) => (c.hits < c.hitsMax)
	});
	if (target) {
		this.heal(target);
		return true;
	}
	return false;
};

StructureTower.prototype.repairRampart = function() {
	const structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (s: Structure) => s.hits < (s.hitsMax - (s.hitsMax * .1)) && s.structureType === STRUCTURE_RAMPART
	});

	if (structure !== undefined) {
		this.repair(structure);
		return true;
	}
	return false;
};
