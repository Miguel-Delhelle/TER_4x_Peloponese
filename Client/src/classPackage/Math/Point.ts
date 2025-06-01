import { HTML } from "../..";


export class Point{
  private _x: number;
  private _y: number;

  constructor(x: number=0, y: number=0){
    this._x = x;
    this._y = y;
  }

  public get x(){return this._x}
  public get y(){return this._y}
  public set x(x:number){this._x = x;}
  public set y(y:number){this._y = y;}

  public getTileAt(nonNull?: boolean, layer?: string|number|Phaser.Tilemaps.TilemapLayer): Phaser.Tilemaps.Tile|null {
    return HTML.mainScene._map.getTileAt(this.x, this.y, nonNull, layer);
  }

  public equals(that:Point):boolean{
    if ((this.x === that.x) && (this.y === that.y)){
        return true;
    }
    else return false;
  }

}