import { Tile } from "./TileModel";
import { Point } from "./Point";
import { Terrain } from "./TerrainModel";
import { IClientToServerEvents } from "common";
import { IGameRoom } from "common";


export class GreekMapModel{
   
   public room:string;
   public dynamicMatrice: Tile[][] = [];
   public staticMatrice: (Tile|null)[][] = [];


   //public dynamicMatrice: Tile[][]

   constructor(room:string = "1222", dynamicMatrice:Tile[][], staticMatrice: (Tile|null)[][]){
      this.room = room;
      this.dynamicMatrice = dynamicMatrice;
      this.staticMatrice = staticMatrice;

   }
}