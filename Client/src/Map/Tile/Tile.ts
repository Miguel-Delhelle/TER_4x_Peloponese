import * as commonGeo from '../../Common/Map_MathsFunctions';
import { Point } from '../../Math/Point';
import { TileBorder } from './TileBorder';
import { TileRegularPolygon } from './TileRegularPolygon';
import { Entity } from '../../Entity/Unity/Entity';
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

export class Tile {
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +--------------------------------------------{ Constructor }--------------------------------------------+     //
  private centerPt!: Point;
  private row!: number;
  private col!: number;
  private svgPolygon!: TileBorder;
  private entities: Entity[] = [];
//       +----------------------------------------------{ Derived }----------------------------------------------+     //
  private _d3Element!: d3.Selection<SVGGElement, unknown, HTMLElement, undefined>;
  private _id!: string;
//       +----------------------------------------------{ Static }-----------------------------------------------+     //
  private static readonly $class: string = "tile";

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public constructor(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    centerPt: Point,
    row: number,
    col: number,
    points: string,
  ) {
    this.centerPt = centerPt;
    this.row = row;
    this.col = col;
    this.setID();
    this.createSVGElement(svg);
    this.svgPolygon = new TileBorder(this, points);
  }

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ACCESSORS  DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public get $row(): number {return this.row;}
  public set $row(value: number) {this.row = value;}
  public get $col(): number {return this.col;}
  public set $col(value: number) {this.col = value;}
  public get $svgPolygon(): TileBorder {return this.svgPolygon;}
  public set $svgPolygon(value: TileBorder) {this.svgPolygon = value;}
  public get $d3Element(): d3.Selection<SVGGElement, unknown, HTMLElement, undefined> {return this._d3Element;}
  private createSVGElement(owner: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {
    this._d3Element = owner.append("g")
      .attr("class", Tile.$class)
      .attr("id", this.$id);
  }
  public get $id(): string {return this._id;}
  private setID(): void {this._id = `${this.$row}.${this.$col}`;}
  public get $centerPt(): Point {return this.centerPt;}
  public set $centerPt(value: Point) {this.centerPt = value;}

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                             METHODS  DEFINITION                                             |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
  public appendD3Element(
    d3ElementName: string,
    attributes: {[key: string]: string} = {},
  ): d3.Selection<SVGElement,unknown,HTMLElement,undefined> {

    let d3Element: d3.Selection<SVGElement,unknown,HTMLElement,undefined> = this.$d3Element.append(d3ElementName);
    for (let att in attributes) {
      d3Element.attr(att,attributes[att]);
    }
    return d3Element;
  }
}