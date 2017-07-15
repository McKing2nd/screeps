require('prototype.spawn');
require('prototype.creep');
require('prototype.tower');

var HOME = 'E98S83';

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    let spawn =  Game.spawns['Spawn1']; 
    
    var towers = spawn.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    
    for (let tower of towers) {
        if(!tower.defend()) {
            tower.healClosest();
            //tower.repairClosest();
        } else {
            console.log('We are under attack!');
        }
    }
    
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
    
    var harvesters = _.filter(creepsInRoom, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(creepsInRoom, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(creepsInRoom, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(creepsInRoom, (creep) => creep.memory.role == 'repairer');
    var wallrepairers = _.filter(creepsInRoom, (creep) => creep.memory.role == 'wallrepairer');
    var miners = _.filter(creepsInRoom, (creep) => creep.memory.role == 'miner');
    var carriers = _.filter(creepsInRoom, (creep) => creep.memory.role == 'carrier');
    
    //var claimersE98S32 = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.target == 'E98S32');
    //var harvestersE98S32 = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'E98S32');

    //var harvestersE97S33 = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'E97S33');
    //var claimersE97S33 =  _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.target == 'E97S33');
    
    var energy = spawn.room.energyCapacityAvailable;
    var newName = undefined;
    
    // TODO Sources wijzigen niet, dus die kunnen we ook in memory plaatsen van de spawn
    let sources = spawn.room.find(FIND_SOURCES);
    
    if (harvesters == 0 && (miners == 0 || carriers == 0)) {
        if(miners > 0) {
            newName = spawn.createCarrier(spawn.room.energyAvailable);
            console.log("Setting Carrier to Spawn");
        } else {
            newName = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester', HOME);
             console.log("Setting Harvester to Spawn");
        }
        console.log('** Recovery mode activated! **')
    } 
    else {
        for(let source of sources) {
            if(!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceID == source.id)) {
                //TODO: Bad performance
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER });
                if(containers.length > 0) {
                    newName = spawn.createMiner(energy, source.id);
                    console.log("Setting Miner to Spawn");
                    break;
                }
            }
        }
    }
    
    if (newName == undefined) {
        if(harvesters.length < 2 && miners.length < sources.length) {
            newName = spawn.createCustomCreep(energy, 'harvester', HOME);
        } else if(carriers.length < sources.length && carriers.length < miners.length ) {
            for(let source of sources) {
                //TODO: Bad performance
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER });
                if(containers.length > 0) {
                    let container = containers[0];
                    if(!_.some(creepsInRoom, c => c.memory.role == 'carrier' && c.memory.containerID == container.id)) {
                        newName = spawn.createCarrier(300, container.id);
                        console.log("Setting carrier to Spawn");
                    }
                }
            }
        } else if (energy >= 450 && upgraders.length < spawn.memory.upgraders) { // TODO: Build something so we can make it easier to Push levels.
            newName = spawn.createUpgrader(energy, HOME);
        // } else if (harvestersE98S32.length < 0) {
        //    newName = spawn.createLongDistanceHarvester(energy, 5, HOME, 'E98S32', 0);
        //} else if (harvestersE97S33.length < 3) {
        //    newName = spawn.createLongDistanceHarvester(energy, 5, HOME, 'E97S33', -1);
        } 

        if (spawn.memory.externalRooms != undefined && spawn.memory.externalRooms.length > 0 && newName == undefined) {
            for(var i = 0; i < spawn.memory.externalRooms.length; i++) {
                var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.target == spawn.memory.externalRooms[i]);
                //console.log("defenders for room " + spawn.memory.externalRooms[i] + ": " + defenders);
                if (defenders.length < 1) {
                    newName = spawn.createDefender(energy, spawn.memory.externalRooms[i]);
                    console.log("Setting defender to spawn");
                }
            } 
        } 
        if (spawn.memory.externalRooms != undefined && spawn.memory.externalRooms.length > 0 && newName == undefined) {
            for(var i = 0; i < spawn.memory.externalRooms.length; i++) {
                var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer' && creep.memory.target == spawn.memory.externalRooms[i]);
                var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.target == spawn.memory.externalRooms[i]);
                if (healers.length < 0) {
                    newName = spawn.createHealer(energy, spawn.memory.externalRooms[i]);
                    console.log("Setting healer to spawn");
                } else if (claimers.length < 1) {
                    newName = spawn.createClaimer(spawn.memory.externalRooms[i]);
                    console.log("Setting claimer to spawn");
                }
            } 
        }
        if (repairers.length < 2 && newName == undefined){
            newName = spawn.createCustomCreep(energy, 'repairer', HOME);
            console.log("Setting repairer to spawn");
        } else if (wallrepairers.length < spawn.memory.wallrepairers && newName == undefined){
            newName = spawn.createCustomCreep(energy, 'wallrepairer', HOME);
            console.log("Setting wallrepairer to spawn");
        } else if (builders.length < spawn.memory.builders && newName == undefined){ // TODO: Spawn only builders when there are construction sites in the room.
            newName = spawn.createCustomCreep(energy, 'builder', HOME);
            console.log("Setting builders to spawn");
        }
    }
    
    if(newName != undefined && newName != ERR_NOT_ENOUGH_ENERGY && newName != ERR_BUSY && newName != ERR_INVALID_ARGS) {
            console.log(spawn +': Spawning new ' + Game.creeps[newName].memory.role +  ' for room ' + Game.creeps[newName].memory.target + ': ' + newName);
    }

    if(spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.work();
    }
}