import { Tile } from "./Tile";
import { Point } from "../../Math/Point";
import { Terrain } from "./Terrain";

export class GreekMap{
   
   public map: Phaser.Tilemaps.Tilemap;
   public dynamicMatrice: Tile[][] = [];
   public staticMatrice: (Tile|null)[][] = [];


   //public dynamicMatrice: Tile[][]

   constructor(map:Phaser.Tilemaps.Tilemap){
      this.map = map;
      this.initStaticMatrice();
      //downloadJSON(this.staticMatrice);
      //this.initDynamicMatrice();

   }


   public initStaticMatrice():void{
      var terrains: Terrain[] = [];
      //var tilesTraite:Point[] = [];
      this.map.getLayer("Montains")?.tilemapLayer.forEachTile(tile => {
         const x: number = tile.x;
         const y: number = tile.y;
         if(tile.index === -1) {
            const tmp = this.map.getTileAt(x,y,false,"Hills");
            if(tmp) tile = tmp;
            else tile = this.map.getTileAt(x,y,false,"Landscape")!;
         }
        
         if(!this.staticMatrice[x]) this.staticMatrice[x] = [];

         let props:any = tile.tileset?.getTileProperties(tile.index);
         console.log(props);
         let dataProps:any = tile.getTileData()!;
         //if(props) {
            let tileID:Point = new Point(tile.x, tile.y);
            const terrain: Terrain = new Terrain(
               props.IsBuildingEnabled ?? false,
               props.IsFarmingEnabled ?? false,
               props.IsWalkingEnabled ?? false,
               props.MovementCost ?? -1,
               dataProps.type ?? "error cc"
            )
            this.staticMatrice[x][y] = new Tile(tileID, terrain);  
         //}else this.staticMatrice[x][y] = null;
         //return null;
      });
   }

   public initDynamicMatrice():void{

   }

}



export function downloadJSON<T extends (string | number | boolean | Tile | T | any)[][]>(data: T, filename: string = "tableau.json") {
   const jsonString = JSON.stringify(data);
   const blob = new Blob([jsonString], { type: "application/json" });
   const url = URL.createObjectURL(blob);
   
   const a = document.createElement("a");
   a.href = url;
   a.download = filename;
   a.click();
 
   URL.revokeObjectURL(url);
 }
 