import { Tile } from "../../Map/Tile/Tile";
import { mapTable } from "../../main";
import * as d3 from "d3";

export class Entity{

  private id:string;
  private graphicEntity:HTMLElement

  constructor(id:string){
    this.id = id;
    this.graphicEntity = document.createElement("svg");
  }

  public appendOnTile(tile_row:number, tile_col:number){
    let tile = this.foundTile(tile_row,tile_col);
    
    d3.select(this.graphicEntity)

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