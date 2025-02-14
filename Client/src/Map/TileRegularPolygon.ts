import { Point } from '../Math/Point';
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
  private centerPt!: Point;
  private nbVertex!: number;
  private innerCircleRadius!: number;
//       +----------------------------------------------{ Derived }----------------------------------------------+     //
  private _angleBetweenAxe!: number;
  private _outerCircleRadius!: number;
  private _polygonPts: Point[] = new Array<Point>();

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public constructor($fromCenterPt: Point, $nbVertex: number, $innerCircleRadius: number) {
    this.centerPt = $fromCenterPt;
    this.nbVertex = $nbVertex;
    this.innerCircleRadius = $innerCircleRadius;
    this.redraw(0);
  }

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ACCESSORS  DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +----------------------------------------------{ centerPt }---------------------------------------------+     //
	public get $centerPt(): Point {return this.centerPt;}
	public set $centerPt(value: Point) {
    this.centerPt = value;
    this.redraw(2);
  }
//       +---------------------------------------------{ nbVertex }----------------------------------------------+     //
	public get $nbVertex(): number  {return this.nbVertex;}
	public set $nbVertex(value: number ) {
    this.nbVertex = value;
    this.redraw(0);
  }
//       +-----------------------------------------{ innerCircleRadius }-----------------------------------------+     //
	public get $innerCircleRadius(): number  {return this.innerCircleRadius;}
	public set $innerCircleRadius(value: number ) {
    this.innerCircleRadius = value;
    this.redraw(1);
  }
//       +------------------------------------------{ angleBetweenAxe }------------------------------------------+     //
	public get $angleBetweenAxe(): number  {return this._angleBetweenAxe;}
	private setAngleBetweenAxe(): void {this._angleBetweenAxe = 2*Math.PI / this.$nbVertex;}
//       +-----------------------------------------{ outerCircleRadius }-----------------------------------------+     //
	public get $outerCircleRadius(): number  {return this._outerCircleRadius;}
	private setOuterCircleRadius(): void {this._outerCircleRadius = this.$innerCircleRadius / Math.cos(this.$angleBetweenAxe / 2.);}
//       +--------------------------------------------{ polygonPts }---------------------------------------------+     //
	public get $polygonPts(): Point[]  {return this._polygonPts;}
	private setPolygonPts(): void {
    const angleStart: number = (this.$angleBetweenAxe / 2.) + Math.PI/2.;
    for (let i=0 ; i<this.$nbVertex ; i++) {
      this._polygonPts[i] = this.$centerPt.ptPolar(i * this.$angleBetweenAxe + angleStart, this.$outerCircleRadius);
    }
  }

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                             METHODS  DEFINITION                                             |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/

  public redraw(flag: number): void {
    flag = Math.abs(Math.floor(flag)%3);
    if (flag==0) {this.setAngleBetweenAxe();this.setOuterCircleRadius();this.setPolygonPts();}
    else if (flag==1) {this.setOuterCircleRadius();this.setPolygonPts();}
    else if (flag==2) {this.setPolygonPts();}
  }

  public distanceFrom(that: TileRegularPolygon): number {
    return this.$centerPt.distanceFrom(that.$centerPt);
  }

  public angleFrom(that: TileRegularPolygon): number {
    return this.$centerPt.angleFrom(that.$centerPt);
  }

}