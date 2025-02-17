import { Point } from '../../Math/Point';
import { Tile } from './Tile';
/*
* → Author     : FLeMMe                                                                                                 *
* → Created on : 2025/02/14                                                                                             *
* → Last modif : 2025/02/14                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Utility ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* The class TileRegularPolygon corresponds to the geometric regular polygon (not the SVG object).                       *
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

export class TileRegularPolygon {
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +--------------------------------------------{ Constructor }--------------------------------------------+     //
  private nbVertex!: number;
  private innerCircleRadius!: number;
  private centerPt!: Point;
//       +----------------------------------------------{ Derived }----------------------------------------------+     //
  private _angleBetweenAxe!: number;
  private _outerCircleRadius!: number;
  private _polygonPts: Point[] = new Array<Point>();
  private _polygonStr!: string;

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public constructor(fromCenterPt: Point, nbVertex: number, innerCircleRadius: number) {
    this.nbVertex = nbVertex;
    this.innerCircleRadius = innerCircleRadius;
    this.centerPt = fromCenterPt;
    this.redraw(0);
  }

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ACCESSORS  DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +---------------------------------------------{ nbVertex }----------------------------------------------+     //
	public get $nbVertex(): number  {return this.nbVertex;}
	public set $nbVertex(value: number ) {
    this.nbVertex = value>2?value:4;
    this.redraw(0);
  }

//       +-----------------------------------------{ innerCircleRadius }-----------------------------------------+     //
	public get $innerCircleRadius(): number  {return this.innerCircleRadius;}
	public set $innerCircleRadius(value: number ) {
    this.innerCircleRadius = value;
    this.redraw(1);
  }

//       +----------------------------------------------{ centerPt }---------------------------------------------+     //
  public get $centerPt(): Point {return this.centerPt;}
  public set $centerPt(value: Point) {
    this.centerPt = value;
    this.redraw(2);
  }

//       +------------------------------------------{ angleBetweenAxe }------------------------------------------+     //
	public get $angleBetweenAxe(): number  {return this._angleBetweenAxe;}
  public static getAngleBetweenAxe(nbVertex: number): number {
    return ((2*Math.PI) / (nbVertex>2?nbVertex:3));
  }
	private setAngleBetweenAxe(nbVertex: number = this.$nbVertex): void {
    this._angleBetweenAxe = TileRegularPolygon.getAngleBetweenAxe(nbVertex);
  }

//       +-----------------------------------------{ outerCircleRadius }-----------------------------------------+     //
	public get $outerCircleRadius(): number  {return this._outerCircleRadius;}
  public static getOuterCircleRadius(
    nbVertex: number,
    innerCircleRadius: number,
    angleBetweenAxe: number = TileRegularPolygon.getAngleBetweenAxe(nbVertex)
  ): number {
    return ((innerCircleRadius>0?innerCircleRadius:1) / (Math.cos(angleBetweenAxe / 2.)));
  }
	private setOuterCircleRadius(
    nbVertex: number = this.$nbVertex,
    innerCircleRadius: number = this.$innerCircleRadius,
    angleBetweenAxe: number = this.$angleBetweenAxe
  ): void {
    this._outerCircleRadius = TileRegularPolygon.getOuterCircleRadius(nbVertex, innerCircleRadius, angleBetweenAxe);
  }

//       +--------------------------------------------{ polygonPts }---------------------------------------------+     //
	public get $polygonPts(): Point[]  {return this._polygonPts;}
	private setPolygonPts(): void {
    const angleStart: number = (this.$angleBetweenAxe / 2.) + Math.PI/2.;
    for (let i=0 ; i<this.$nbVertex ; i++) {
      this._polygonPts[i] = this.$centerPt.ptPolar(i * this.$angleBetweenAxe + angleStart, this.$outerCircleRadius);
    }
  }

//       +--------------------------------------------{ polygonStr }---------------------------------------------+     //
  public get $polygonStr(): string  {return this._polygonStr;}
  public static getPolygonStr(polygonPts: Point[], centerPt: Point = new Point(0,0)): string {
    let str: string = "";
    for (let pt of polygonPts) {str += `${pt.$x+centerPt.$x},${pt.$y+centerPt.$y} `;}
    return str.trimEnd();
  }
  private setPolygonStr(): void {this._polygonStr = TileRegularPolygon.getPolygonStr(this.$polygonPts);}

  /*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                             METHODS  DEFINITION                                             |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/

  private redraw(flag: number): void {
    flag = Math.abs(Math.floor(flag)%3);
    if (flag==0) {this.setAngleBetweenAxe();this.setOuterCircleRadius();this.setPolygonPts();this.setPolygonStr()}
    else if (flag==1) {this.setOuterCircleRadius();this.setPolygonPts();this.setPolygonStr();}
    else if (flag==2) {this.setPolygonPts();this.setPolygonStr();}
  }

  public distanceFrom(that: TileRegularPolygon): number {
    return this.$centerPt.distanceFrom(that.$centerPt);
  }

  public static distanceFrom($this: TileRegularPolygon, $that: TileRegularPolygon): number {
    return $this.$centerPt.distanceFrom($that.$centerPt);
  }

  public angleFrom(that: TileRegularPolygon): number {
    return this.$centerPt.angleFrom(that.$centerPt);
  }

  public static angleFrom($this: TileRegularPolygon, $that: TileRegularPolygon): number {
    return $this.$centerPt.distanceFrom($that.$centerPt);
  }

  public static getInRadFromOutDiam(nbVertex: number, outerCircleDiameter: number): number {
    let outerCircleRadius: number = Math.abs(outerCircleDiameter) / 2.;
    return (outerCircleRadius * Math.cos(TileRegularPolygon.getAngleBetweenAxe(nbVertex)/2.));
  }

  public copy(centerPt: Point = this.$centerPt): TileRegularPolygon {
    return new TileRegularPolygon(centerPt, this.$nbVertex, this.$innerCircleRadius);
  }

}