import { mainScene} from "../..";


export class Point{
   private _x:number
   private _y:number

   constructor(x:number,y:number){
      this._x = x;
      this._y = y;
   }

   public get x(){return this._x}
   public get y(){return this._y}
   public set x(newX:number){this._x = newX;}
   public set y(newY:number){this._y = newY;}

   public get tile():Phaser.Tilemaps.Tile{
      return mainScene._map.getTileAt(this.x,this.y)!;
   }

   public equals(that:Point):boolean{
      if ((this.x === that.x) && (this.y === that.y)){
         return true;
      }
      else return false;
   }

}