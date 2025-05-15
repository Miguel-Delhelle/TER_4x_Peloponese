import type { Point } from "../../Math/Point";
import { FACTION } from "../../Player/EFaction";
import type { Terrain } from "./Terrain";

export class Tile{

   public id:Point;
   public terrain:Terrain;
   private faction:FACTION;

   constructor(id: Point, terrain: Terrain, faction:FACTION = FACTION.WILDERNESS) {
      this.id = id;
      this.terrain = terrain;
      this.faction = faction
   }


}

