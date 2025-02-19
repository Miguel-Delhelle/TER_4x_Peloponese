import * as d3 from 'd3';
import { Point } from "../Math/Point";
import { Tile } from "./Tile/Tile";
import { TileRegularPolygon } from "./Tile/TileRegularPolygon";
/*
* → Author     : $Author$                                                                                               *
* → Created on : 2025/$$/$$                                                                                             *
* → Last modif : 2025/$$/$$                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Utility ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* $Explain in few lines the goal of this class (what it's for)$                                                         *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • •[ Attribute ]• • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This function has $ attributes:                                                                                       *
*   • $att0$          → $Explain in few lines the utility of this attribute, what it corresponds to with few details    *
*   |                   on how to use it or even its limits.$                                                           *
*   | type: $any$                                                                                                       *
*   | ex: $, ...                                                                                                        *
*                                                                                                                       *
*   • $_att1$         → $Explain in few lines the utility of this attribute, what it corresponds to with few details    *
*   |                   on how to use it or even its limits.$                                                           *
*   | dependancy: $att0$, ...                                                                                           *
*   | type: $any$                                                                                                       *
*   | ex: $, ...                                                                                                        *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ History ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* See below the version table:                                                                                          *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
* |   Version   |    Date    | Author |                                  Description                                  | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
* | ##.##.##.## | yyyy/mm/dd |        |                                                                               | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
* |     1.0.0.0 | 2025/--/-- |   $$   | Creation of the class                                                         | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
*/

export class Map {
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
  private name!: string;
  private ptTopLeft!: Point;
  private nbTilesX!: number;
  private nbTilesY!: number;
  private dimTile!: number;
  private tileStyle! : 4|6;
  private _tilePolygon!: TileRegularPolygon;
  private _mapTable: Tile[][] = new Array<Tile[]>(); // _mapTable[y][x]
  private _svgMap!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private static readonly $class = "map svg";
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public constructor(
    containerID: string,
    mapName: string = "",
    ptTopLeft: Point = new Point(0,0),
    nbTilesX: number = 60,
    nbTilesY: number = 60,
    dimTile: number = 75,
    tileStyle: 4|6 = 6,
  ) {
    this.name = mapName;
    this.ptTopLeft = ptTopLeft;
    this.nbTilesX = nbTilesX;
    this.nbTilesY = nbTilesY;
    this.dimTile = dimTile;
    this.tileStyle = tileStyle;
    this.setTilePolygon();
    this.setMapTable(containerID);
  }

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ACCESSORS  DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +---------------------------------------------{ ptTopLeft }---------------------------------------------+     //
  public get $name(): string {return this.name;}
  public set $name(value: string) {this.name = value;}

//       +---------------------------------------------{ ptTopLeft }---------------------------------------------+     //
  public get $ptTopLeft(): Point {return this.ptTopLeft;}
  public set $ptTopLeft(value: Point) {this.ptTopLeft = value;}

//       +---------------------------------------------{ nbTilesX }----------------------------------------------+     //
  public get $nbTilesX(): number {return this.nbTilesX;}
  public set $nbTilesX(value: number) {this.nbTilesX = value>0?value:1;}

//       +---------------------------------------------{ nbTilesY }----------------------------------------------+     //
  public get $nbTilesY(): number {return this.nbTilesY;}
  public set $nbTilesY(value: number) {this.nbTilesY = value>0?value:1;}

//       +----------------------------------------------{ dimTile }----------------------------------------------+     //
  public get $dimTile(): number {return this.dimTile;}
  public set $dimTile(value: number) {this.dimTile = value>0?value:1;}

//       +---------------------------------------------{ tileStyle }---------------------------------------------+     //
  public get $tileStyle(): number {return this.tileStyle;}
  public set $tileStyle(value: 4|6) {this.tileStyle = value;}

//       +--------------------------------------------{ tilePolygon }--------------------------------------------+     //
  public get $tilePolygon(): TileRegularPolygon {return this._tilePolygon;}
  private setTilePolygon(): void {
    this._tilePolygon = new TileRegularPolygon(
      this.$ptTopLeft.ptAbsolute(this.$dimTile/4.,this.$dimTile/4., 1),
      this.$tileStyle,
      TileRegularPolygon.getInRadFromOutDiam(this.$tileStyle, this.$dimTile),
    );
  }
  public get $svgMap(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {return this._svgMap;}
  private set $svgMap(value: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) {this._svgMap = value;}

//       +--------------------------------------------{ tilePolygon }--------------------------------------------+     //
  public get $mapTable(): Tile[][] {return this._mapTable;}
  private setMapTable(containerID: string): void {
    let owner: d3.Selection<d3.BaseType, unknown, HTMLElement, any> = d3.select(containerID);
    if (owner.empty()) {return;}
    this.$svgMap = owner.append("svg")
      .attr("id",this.$name)
      .attr("class",Map.$class)
      .attr("width",this.$nbTilesX * this.$dimTile)
      .attr("height", this.$nbTilesY * this.$dimTile);
    let fromPt: Point = this.$tilePolygon.$centerPt;
    const anglePolygon: number = Math.PI/2. - (2*Math.PI / this.$tilePolygon.$nbVertex) ;
    const icr: number = this.$tilePolygon.$innerCircleRadius;
    for (let y=0 ; y<this.$nbTilesY ; y++) {
      this._mapTable[y] = new Array<Tile>();
      let centerPt: Point = fromPt.ptPolar(Math.PI/2., 2*icr*y, 1);
      for (let x=0 ; x<this.$nbTilesX ; x++) {
        let tile: Tile = new Tile(this.$svgMap, centerPt, y, x, TileRegularPolygon.getPolygonStr(this.$tilePolygon.$polygonPts, centerPt));
        this._mapTable[y][x] = tile;
        centerPt = centerPt.ptPolar((x%2==0)?anglePolygon:-anglePolygon, 2*icr, 1);
      }
    }
  }

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                             METHODS  DEFINITION                                             |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

}