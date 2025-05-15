import type { Point } from "../../Math/Point";
import type { FACTION } from "../../Player/faction";
import type { Terrain } from "./Terrain";

export class Tile{

   public id:Point;
   public terrain:Terrain;
   //private faction:FACTION;

   constructor(id: Point, terrain: Terrain) {
      this.id = id;
      this.terrain = terrain;
   }


}