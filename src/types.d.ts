// type shim for nodejs' `require()` syntax
declare const require: (module: string) => any;

//** Memory declarations *//

interface SpawnMemory {
    home: string
    upgraders: number
    buiders: number
    repairers: number
    wallrepairers: number
    externalRooms: string[]
}

interface CreepMemory {
    role: string
    working: boolean
    target: string
}