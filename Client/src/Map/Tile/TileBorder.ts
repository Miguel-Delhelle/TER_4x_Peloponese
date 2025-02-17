import { TileRegularPolygon } from "./TileRegularPolygon";
import { Tile } from "./Tile";
import { Point } from "../../Math/Point";
/*
* → Author     : FLeMMe                                                                                               *
* → Created on : 2025/02/14                                                                                             *
* → Last modif : 2025/02/14                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Utility ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* $Explain in few lines the goal of this class (what it's for)$                                                         *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • •[ Attribute ]• • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This class has $ attributes:                                                                                          *
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
* |     1.0.0.0 | 2025/02/14 | FLeMMe | Creation of the class                                                         | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
*/

export class TileBorder {
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +--------------------------------------------{ Constructor }--------------------------------------------+     //
  private polygon!: string;
  private ownerTile!: Tile;
//       +----------------------------------------------{ Derived }----------------------------------------------+     //
  private _d3Element!: d3.Selection<SVGPolygonElement, unknown, HTMLElement, undefined>;
  private static readonly $class: string = "tile border";
  
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public constructor(owner: Tile, polygon: string) {
    this.polygon = polygon;
    this.ownerTile = owner;
    this.createSVGElement(owner.$d3Element);
  }
  
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ACCESSORS  DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +----------------------------------------------{ polygon }----------------------------------------------+     //
  public get $polygon(): string {return this.polygon;}
  public set $polygon(value: string) {
    this.polygon = value;
    this.init();
  }

//       +---------------------------------------------{ ownerTile }---------------------------------------------+     //
  public get $ownerTile(): Tile {return this.ownerTile;}
  public set $ownerTile(value: Tile) {
    this.ownerTile = value;
    this.init();
  }

//       +---------------------------------------------{ d3Element }---------------------------------------------+     //
  public get $d3Element(): d3.Selection<SVGPolygonElement, unknown, HTMLElement, undefined> {return this._d3Element;}
  private createSVGElement(owner: d3.Selection<SVGGElement,unknown,HTMLElement,undefined>): void {
    this._d3Element = owner.append("polygon")
      .attr("class",TileBorder.$class)
      .attr("points",this.$polygon);
  }
  
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                             METHODS  DEFINITION                                             |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
  public init(): void {}
  
}