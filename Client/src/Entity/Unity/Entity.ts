import { ɵIS_HYDRATION_DOM_REUSE_ENABLED } from "@angular/core";
import { Tile } from "../../Map/Tile/Tile";
import { mapTable } from "../../main";
import { text } from "d3";

export class Entity{

  private id:string;
  private docHtml:HTMLElement;

  constructor(id:string){
    this.id = id;
    this.docHtml = this.initHtml();
  }

  public appendOnTile(tile_row:number, tile_col:number):void{
    let tile = this.foundTile(tile_row,tile_col);
    tile.appendTextD3Element("text",this.id)
    
    //let element = this.getElementHtml();

    //tile.appendChild(element);
  }

  private foundTile(tile_row:number, tile_col:number):Tile{
    return mapTable[tile_row][tile_col];
  }
  
  private initHtml():HTMLElement{
    let element:HTMLElement = document.createElement("div");
    element.style.visibility = "hidden" ;

    return element;
  }

  public getElementHtml():HTMLElement{
    return this.docHtml;
  }

}