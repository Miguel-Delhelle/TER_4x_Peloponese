import { Tile } from "./TileModel";
import { Point } from "./Point";
import { Terrain } from "./TerrainModel";
import { FACTION } from "./EFaction";

export class GreekMapModel{
   
   public room:string;
   public dynamicMatrice: Tile[][] = [];
   public staticMatrice: (Tile|null)[][] = [];


   //public dynamicMatrice: Tile[][]

   constructor(room:string, dynamicMatrice:Tile[][], staticMatrice: (Tile|null)[][]){
      this.room = room;
      this.dynamicMatrice = dynamicMatrice;
      this.staticMatrice = staticMatrice;

   }
}