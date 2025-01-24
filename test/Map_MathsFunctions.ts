/*
* +--+-------------------------------------------{ Function Definition }-------------------------------------------+--+ *
* |  |                                                    polar                                                    |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*                                                                                                                       *
* → Author     : Luna                                                                                                   *
* → Created on : 2025/01/24                                                                                             *
* → Last modif : 2025/01/24                                                                                             *
* → Version    : 1.0.0.O                                                                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Utility ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* Calculate the 2D {x,y} coordinates of a point from another point given the angle and distance between the 2 points    *
* using trigonometry. Assuming the 'angle' is given in degrees from the X axis (East direction from 'fromPt') to the    *
* segment [fromPt,toPt] following the rules of trigonometry. For example, East axis equals 0°, North axis equals 90°/   *
* -270°, West axis equals 180°/-180° and South axis equals 270°/-90°.                                                   *
* See example below:                                                                                                    *
*                                                      • toPt {x,y}                                                     *
*                                                     /                                                                 *
*                                           distance /  angle                                                           *
*                                                   / ↑                                                                 *
*                                     fromPt {x,y} •--------------- → (X axis= 0°)                                      *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • •[ Parameter ]• • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This function has 3 arguments:                                                                                        *
*   • fromPt          → is a 2-dimension's dict of numbers (float) representing 2D coordinates {x,y} of a know point    *
*   |                   from which we will calculate the coordinates of the other point.                                *
*   | type: dict      | ex: {15.29, -12}, {0,0}, ...                                                                    *
*                                                                                                                       *
*   • angle           → is the angle (in degrees) between the X axis and the 2 points (see example above).              *
*   | type: number    | ex: 60, 30, 72.45, ...                                                                          *
*                                                                                                                       *
*   • distance        → is the distance between the 2 points (see example above).                                       *
*   | type: number    | ex: 10, 20., 11.26, ...                                                                         *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Returns ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This function returns a dictionary of numbers (float) representing the 2D coordinates {x,y} of the point              *
* corresponding to the given translation parameters.                                                                    *
*   ex: polar({x: 0, y: 0}, 90, 10) returns {x: 0, y:10}.                                                               *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ History ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* See below the version table:                                                                                          *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
* |   Version   |    Date    | Author |                                  Description                                  | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
* | ##.##.##.## | yyyy/mm/dd |        |                                                                               | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
* |     1.0.0.0 | 2025/01/24 | Luna   | Creation of the function                                                      | *
* +-------------+------------+--------+-------------------------------------------------------------------------------+ *
*/
function polar(
    fromPt: {x: number; y: number} | number[],
    angle: number,
    distance: number
  ): {x: number, y: number} {
  if (Array.isArray(fromPt)) {
    if (fromPt.length>=2) {
      fromPt = {x: fromPt[0], y: fromPt[1]} ;
    } else {
      throw new Error("Invalid coordinates...It requires an array of 2 numbers or a dictionary {x: number, y: number}.")
    }
  }
  const angRad = (angle%360 * Math.PI) / 180. ;
  return {
    x: Math.round((fromPt.x + distance * Math.cos(angRad)) * 1e6) / 1e6,
    y: Math.round((fromPt.y + distance * Math.sin(angRad)) * 1e6) / 1e6,
  };
}