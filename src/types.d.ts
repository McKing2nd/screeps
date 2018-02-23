// type shim for nodejs' `require()` syntax
declare const require: (module: string) => any;

// ** Creeps role declarions ** //
declare const LONG_DISTANCE_HARVESTER = "longDistanceHarvester";

// ** Memory declarations ** //

interface SpawnMemory {
    home: string;
    upgraders: number;
    builders: number;
    repairers: number;
    wallrepairers: number;
    externalRooms: string[];
    initialized: boolean;
}

interface CreepMemory {
    role: string;
    working: boolean;
    target: string;
    sourceID?: string;
    home: string;
    containerID?: string;
    exit?: ScreepsReturnCode | ExitConstant ;
    sourceIndex?: number;
}

interface RoomMemory {
    wait: boolean;
}


// ** Temp ** //
interface StructureSpawn {
    createCustomCreep(energy: number, role: string, home: string): ScreepsReturnCode;
    createCarrier(energy: number, container: string | null, home: string, target: string): ScreepsReturnCode;
    createDefender(energy: number, room: string): ScreepsReturnCode;
    createUpgrader(energy: number, home: string): ScreepsReturnCode;
    createHealer(energy: number, room: string): ScreepsReturnCode;
    createMiner(energy: number, sourceID: string): ScreepsReturnCode;
    createClaimer(target: string): ScreepsReturnCode;
    createLongDistanceHarvester(energy: number, numberOfWorkParts: number, home: string, target: string, sourceIndex: number): ScreepsReturnCode;
    init(): void;
}

interface StructureTower {
    defend(): boolean;
    healClosest(): boolean;
    repairClosest(): boolean;
    repairRampart(): boolean;
}

/** State machinery **/
declare const STATE_WORKING = 900;
declare const STATE_MOVING_TO_TARGET = 905;
declare const STATE_MOVING_TO_HOME = 910;
declare const STATE_HARVESTING = 915;
declare const STATE_GET_ENERGY = 920;
declare const STATE_GATHERING = 925;

type STATE_WORKING = 900;
type STATE_MOVING_TO_TARGET = 905;
type STATE_MOVING_TO_HOME = 910;
type STATE_HARVESTING = 915;
type STATE_GET_ENERGY = 920;
type STATE_GATHERING = 925;

type State = 
    STATE_WORKING |
    STATE_MOVING_TO_TARGET |
    STATE_MOVING_TO_HOME |
    STATE_HARVESTING |
    STATE_GET_ENERGY |
    STATE_GATHERING
    ;

/** Creep Roles */

type ROLE_HARVESTER = "harvester";
type ROLE_UPGRADER = "upgrader";
type ROLE_BUILDER = "builder";
type ROLE_REPAIRER = "repairer";
type ROLE_WALLREPAIRER = "wallrepairer";
type ROLE_MINER = "miner";
type ROLE_CARRIER = "carrier";

type CreepRole =
    ROLE_HARVESTER |
    ROLE_UPGRADER |
    ROLE_BUILDER |
    ROLE_REPAIRER |
    ROLE_WALLREPAIRER |
    ROLE_MINER |
    ROLE_CARRIER;
