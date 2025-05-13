import { mainScene} from "../..";


export class Point{
   private x:number
   private y:number

   constructor(x:number,y:number){
      this.x = x;
      this.y = y;
   }

   public get _x(){return this.x}
   public get _y(){return this.y}
   public set _x(newX:number){this.x = newX;}
   public set _y(newY:number){this.y = newY;}

   public get _Tile():Phaser.Tilemaps.Tile{
      return mainScene._map.getTileAt(this._x,this._y)!;
   }

}