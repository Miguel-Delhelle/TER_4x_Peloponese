import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { User } from './User';
import * as d3 from 'd3';
import { Unit } from './Entity/Unity/Unit';
import { Map } from './Map/Map';
import { Tile } from './Map/Tile/Tile';
import { TileRegularPolygon } from './Map/Tile/TileRegularPolygon';
import { TilePolygonSquare } from './Map/Tile/TilePolygonSquare';
import { TilePolygonHexagon } from './Map/Tile/TilePolygonHexagon';
import { Point } from './Math/Point';
import { polar } from './Common/Map_MathsFunctions';
//import * as utilGA from './Common/Util';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


window.addEventListener("load",main);
export var mapTable:Tile [][];
export var map:Map;

function main(){
  console.log("Coucou toi");

  let clientTest = new User();
  var bodyElement = document.getElementById("body");

  clientTest.listenForMessages();
  clientTest.sendMessage("Bien connectée");

  let pt1: Point = new Point(4, 8); console.log(pt1);
  /*
  console.log(polar([pt1.$x,pt1.$y],Math.PI/2.,10));
  console.log(pt1.ptPolar(Math.PI/2., 10, 1));
  let testPolygon: TileRegularPolygon = new TileRegularPolygon(pt1, 4, 25); console.log(testPolygon);
  let testHexagon: TilePolygonHexagon = new TilePolygonHexagon(pt1, 25); console.log(testHexagon);
  console.log(TileRegularPolygon.getInRadFromOutDiam(4,75));
  console.log(TileRegularPolygon.getAngleBetweenAxe(4));
  */
  map = new Map("body","SuperMap",undefined,60,60,75,6); console.log(map);
  mapTable = map.$mapTable;
  let uniteTest:Unit = new Unit();
  uniteTest.appendOnTile(9,9);

  //utilGA.exportToJson(listTiles,"listTile.json");
  var isOn: boolean = false;
  var pch: any;
  bodyElement?.addEventListener("click",player);

  function player(): void {
    if (isOn) {isOn=false; pch=clearInterval(pch);}
    else {isOn=true; pch=setInterval(changePlayer,1500);}
  }
}

function changePlayer(): void {
  let i: number = +document.documentElement.getAttribute("player")!;
  document.documentElement.setAttribute("player",""+((i%3)+1));
}