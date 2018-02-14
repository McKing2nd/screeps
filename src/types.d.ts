// type shim for nodejs' `require()` syntax
declare const require: (module: string) => any;

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
    exit?: ScreepsReturnCode | ExitConstant | undefined;
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
