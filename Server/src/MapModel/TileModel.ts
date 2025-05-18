import { Point } from "./Point";
import { FACTION } from "./EFaction";
import type { Terrain } from "./TerrainModel";

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

