import { MyCreep } from "./CreepRole";

export class Upgrader extends MyCreep {

    public run(): void {
        if (this.isWorking()) {
            if (this.creep.upgradeController(this.creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller as StructureController,
                    { visualizePathStyle: { stroke: "#ffffff" } });
            }
        } else {
            this.getEnergy();
        }
    }
}
