import { MyCreep } from "./roles/CreepRole";
import { ScreepRoleFactory } from "./ScreepRoleFactory";

export class RoomRunner {

    private room: Room;

    public constructor(room: Room) {
        this.room = room;
    }

    public run(): void {
        this.runTowers();
        this.runCreeps();
    }

    private runTowers(): void {
        const towers = this.getTowers();
        for (const tower of towers) {
            if (!tower.defend() && !tower.healClosest()) {
                tower.repairClosest();
            } else {
                console.log("We are under attack!");
            }
        }
    }

    private runCreeps(): void {
        for (const name in Game.creeps) {
            const creep: MyCreep | null = ScreepRoleFactory.newFor(Game.creeps[name]);
            if (creep !== null) {
                creep.work();
            }
        }
    }

    public getTowers(): StructureTower[] {
        return this.room.find<StructureTower>(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_TOWER
        });
    }
}
