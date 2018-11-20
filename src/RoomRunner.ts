import { MyCreep } from "./roles/CreepRole";
import { ScreepRoleFactory } from "./ScreepRoleFactory";

export class RoomRunner {

    private room: Room;

    public constructor(room: Room) {
        this.room = room;
    }

    public run(): void {
        this.runTowers();
        // this.runLinks();
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

    public getTowers(): StructureTower[] {
        return this.room.find<StructureTower>(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_TOWER
        });
    }

    private runLinks(): void {
        // console.log("Implement me!");
    }
}
