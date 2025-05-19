import type { Point } from "../../Math/Point";
import { FACTION } from "../../Entity/EFaction";
import type { Terrain } from "./Terrain";

export class Tile{

   public id:Point;
   public terrain:Terrain;
   private faction:string;

   constructor(id: Point, terrain: Terrain, faction:string = "Wilderness") {
      this.id = id;
      this.terrain = terrain;
      this.faction = faction
   }

   public get _faction(){
      return this.faction;
   }


}

