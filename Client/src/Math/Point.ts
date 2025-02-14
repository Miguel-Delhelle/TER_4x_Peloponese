import * as util from '../Common/Util';
/*
* → Author     : FLeMMe                                                                                                 *
* → Created on : 2025/02/14                                                                                             *
* → Last modif : 2025/02/14                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Utility ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* The class Point corresponds to 2D coordinates [x,y] (in pixels) on a web page and allows to perform few geometric     *
* operations between Points.                                                                                            *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • •[ Attribute ]• • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This function has 2 attributes:                                                                                       *
*   • x               → corresponds to the 2D coordinate on the X axis (horizontal), considering 0+ from left to right  *
*   | type: number                                                                                                      *
*   | ex: 0, -32, 17.819852, ...                                                                                        *
*                                                                                                                       *
*   • y               → corresponds to the 2D coordinate on the Y axis (vertical), considering 0+ from top to bottom    *
*   | type: number                                                                                                      *
*   | ex: 0, -32, 17.819852, ...                                                                                        *
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

export class Point {
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  private x: number = 0;
  private y: number = 0;

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
  public constructor($x: number , $y: number ) {
    this.x = $x;
    this.y = $y;
  }
	
/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                            ACCESSORS  DEFINITION                                            |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +-------------------------------------------------{ x }-------------------------------------------------+     //
  public get $x(): number {return this.x;}
  public set $x(value: number) {this.x = value;}
//       +-------------------------------------------------{ y }-------------------------------------------------+     //
  public get $y(): number {return this.y;}
  public set $y(value: number) {this.y = value;}

/*
* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
* |  |                                             METHODS  DEFINITION                                             |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*/
//       +-----------------------------{ Calculate Geometric Data between 2 Points }-----------------------------+     //
  // Calculate the Delta-X (difference of X coordinates) between 'this' Point and 'that' Point coordinates
  public Dx(that: Point): number {
    return that.$x - this.$x;
  }
  
  // Calculate the Delta-Y (difference of Y coordinates) between 'this' Point and 'that' Point coordinates
  public Dy(that: Point): number {
    return that.$y - this.$y;
  }

  // Calculate the distance between 'this' Point and 'that' Point coordinates
  public distanceFrom(that: Point): number {
    return util.round(Math.sqrt(Math.pow(this.Dx(that), 2) + Math.pow(this.Dy(that), 2)), 1E6);
  }

  // Calculate the angle between the X(0+) axis and the segment going from 'this' Point and 'that' Point coordinates
  public angleFrom(that: Point): number {
    return Math.atan2(this.Dy(that), this.Dx(that));
  }

//       +-------------------------------{ Create a new Point  from 'this' Point }-------------------------------+     //
  // Create a new Point based on vector polar coordinates calculations given an origin Point('this'), an 'angle' and a 'distance'
  public ptPolar(angle: number, distance: number): Point {
    return new Point(
      util.round(this.$x + distance + Math.cos(angle), 1E6),
      util.round(this.$y + distance + Math.sin(angle), 1E6),
    );
  }

  // Create a new Point based on vector absolute coordinates calculations given an origin Point('this'), an Delta-X and Delta-Y
  public ptAbsolute(Dx: number, Dy: number): Point {
    return new Point(
      util.round(this.$x + Dx, 1E6),
      util.round(this.$y + Dy, 1E6),
    )
  }

}