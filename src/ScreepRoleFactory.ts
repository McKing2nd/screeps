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
            case "builder":
                myCreep = new Builder(creep);
                break;
            case "carrier":
                myCreep = new Carrier(creep);
                break;
            case "claimer":
                myCreep = new Claimer(creep);
                break;
            case "defender":
                myCreep = new Defender(creep);
                break;
            case "harvester":
                myCreep = new Harvester(creep);
                break;
            case "healer":
                myCreep = new Healer(creep);
                break;
            case "longDistanceHarvester":
                myCreep = new LongDistanceHarvester(creep);
                break;
            case "miner":
                myCreep = new Miner(creep);
                break;
            case "repairer":
                myCreep = new Repairer(creep);
                break;
            case "upgrader":
                myCreep = new Upgrader(creep);
                break;
        }
        return myCreep;
    }
}
