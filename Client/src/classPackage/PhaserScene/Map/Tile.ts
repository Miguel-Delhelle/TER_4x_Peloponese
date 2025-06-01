import type { Point } from "../../Math/Point";
import { FACTION } from "../../Entity/EFaction";
import type { Terrain } from "./Terrain";
import { HTML } from "../../..";

export class Tile{

   public id:Point;
   public terrain:Terrain;
   public faction:string;

   constructor(id: Point, terrain: Terrain, faction:string = "Wilderness") {
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

