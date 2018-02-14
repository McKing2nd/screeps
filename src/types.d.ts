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
}

interface CreepMemory {
    role: string;
    working: boolean;
    target: string;
    sourceID: string;
    home: string;
    containerID: string;
    exit: ScreepsReturnCode | ExitConstant | undefined;
    sourceIndex: number;
}

interface RoomMemory {
    wait: boolean;
}

// ** Temp ** //
interface StructureSpawn {
    createCustomCreep(energy: number, role: string, home: string): void;
    createCarrier(energy: number): void;
    createCarrier(energy: number, container: string | null, home: string, target: string): void;
    createDefender(energy: number, room: string): void;
    createUpgrader(energy: number, home: string): void;
    createHealer(energy: number, room: string): void;
    createMiner(energy: number, sourceID: string): void;
    createClaimer(target: string): void;
}

interface StructureTower {
    defend(): void;
    healClosest(): void;
    repairClosest(): void;
}
