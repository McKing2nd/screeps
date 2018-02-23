import { Builder } from "./roles/BuilderRole";
import { Carrier } from "./roles/CarrierRole";
import { Claimer } from "./roles/ClaimerRole";
import { MyCreep } from "./roles/CreepRole";
import { Defender } from "./roles/DefenderRole";
import { Harvester } from "./roles/HarvesterCreepRole";
import { Healer } from "./roles/HealerRole";
import { LongDistanceHarvester } from "./roles/LongDistanceHarvester";
import { Miner } from "./roles/MinerCreepRole";
import { Repairer } from "./roles/RepairerRole";
import { Upgrader } from "./roles/UpgraderRole";

export class ScreepRoleFactory {
    public static newFor(creep: Creep): MyCreep | null {
        let myCreep: MyCreep | null = null;

        switch (creep.memory.role) {
            case MyCreep.ROLE_BUILDER:
                myCreep = new Builder(creep);
                break;
            case MyCreep.ROLE_CARRIER:
                myCreep = new Carrier(creep);
                break;
            case MyCreep.ROLE_CLAIMER:
                myCreep = new Claimer(creep);
                break;
            case MyCreep.ROLE_DEFENDER:
                myCreep = new Defender(creep);
                break;
            case MyCreep.ROLE_HARVESTER:
                myCreep = new Harvester(creep);
                break;
            case MyCreep.ROLE_HEALER:
                myCreep = new Healer(creep);
                break;
            case MyCreep.ROLE_LONGDISTANCEHARVESTER:
                myCreep = new LongDistanceHarvester(creep);
                break;
            case MyCreep.ROLE_MINER:
                myCreep = new Miner(creep);
                break;
            case MyCreep.ROLE_REPAIRER:
                myCreep = new Repairer(creep);
                break;
            case MyCreep.ROLE_UPGRADER:
                myCreep = new Upgrader(creep);
                break;
            case MyCreep.ROLE_WALLREPAIRER:
                console.log("Wallrepairer is not implemented (yet)");
                break;
            default:
                console.log("No role found " + creep.memory.role);
                break;
        }
        return myCreep;
    }
}
