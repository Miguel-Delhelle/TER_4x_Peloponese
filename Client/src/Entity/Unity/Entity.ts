import { Tile } from "../../Map/Tile/Tile";
import { mapTable } from "../../main";

export class Entity{

  private id:string;

  constructor(id:string){
    this.id = id;
  }

  public appendOnTile(tile_row:number, tile_col:number){
    let tile = this.foundTile(tile_row,tile_col);
    
    let element = this.getElement();

    tile.$d3Element.append(element);

  }

  private foundTile(tile_row:number, tile_col:number):Tile{
    return mapTable[tile_row][tile_col];
  }
  
  private getElement():HTMLElement | null {
    let element = document.getElementById(this.id);
    if (element == null){
      throw "Element html inexistant";
    }
    return element;
  }

}