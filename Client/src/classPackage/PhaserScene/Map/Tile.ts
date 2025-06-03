import type { Point } from "../../Math/Point";
import type { Terrain } from "./Terrain";
import { HTML } from "../../..";
import { FACTION } from "common";

export class Tile{

   public id:Point;
   public terrain:Terrain;
   public faction:FACTION;

   constructor(id: Point, terrain: Terrain, faction:FACTION = FACTION.WILDERNESS) {
      this.id = id;
      this.terrain = terrain;
      this.faction = faction
   }

   public get _faction(){
      return this.faction;
   }

   public get _terrain(){
      return this.terrain;
   }

   public get _id(){
      return this.id;
   }
   
   public get _phaserTile(){
      return HTML.mainScene._map.getTileAt(this.id.x,this.id.y);
   }


}

