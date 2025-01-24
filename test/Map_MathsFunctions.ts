/*
* +--+-------------------------------------------{ Function Definition }-------------------------------------------+--+ *
* |  |                                                    polar                                                    |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*                                                                                                                       *
* → Author     : Luna                                                                                                   *
* → Created on : 2025/01/24                                                                                             *
* → Last modif : 2025/01/24                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
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
* This function has 3 argument(s):                                                                                      *
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
  fromPt: {x: number; y: number},
  angle: number,
  distance: number
): {x: number, y: number} {
  const angRad: number = angDeg2Rad(angle) ;
  return {
    x: Math.round((fromPt.x + distance * Math.cos(angRad)) * 1e6) / 1e6,
    y: Math.round((fromPt.y + distance * Math.sin(angRad)) * 1e6) / 1e6,
  };
}

/*
* +--+-------------------------------------------{ Function Definition }-------------------------------------------+--+ *
* |  |                                                 angDeg2Rad                                                  |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*                                                                                                                       *
* → Author     : Luna                                                                                                   *
* → Created on : 2025/01/24                                                                                             *
* → Last modif : 2025/01/24                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Utility ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* Converts an angular value in degrees into an angular value in radians.                                                *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • •[ Parameter ]• • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This function has 1 argument(s):                                                                                      *
*   • angleInDegree   → is the angular value in degrees.                                                                *
*   | type: number    | ex: 10, 20., -90, 8882, ...                                                                     *
*                                                                                                                       *
*  • • • • • • • • • • • • • • • • • • • • • • • • • • [ Returns ] • • • • • • • • • • • • • • • • • • • • • • • • • •  *
* This function returns a angular value in radians.                                                                     *
*   ex: angDeg2Rad(90) returns 1.5707963267948966... (= Math.PI/2)                                                      *
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
function angDeg2Rad(
  angleInDegree: number
): number {
  return (angleInDegree%360 * Math.PI) / 180. ;
}

function angRad2Deg(
  angleInRadian: number
): number {
  return (angleInRadian%(2 * Math.PI) * 180.) / Math.PI ;
}

/*
* +--+-------------------------------------------{ Function Definition }-------------------------------------------+--+ *
* |  |                                          hexaPtsFromCenterByRadius                                          |  | *
* +--+-------------------------------------------------------------------------------------------------------------+--+ *
*                                                                                                                       *
* → Author     : Luna                                                                                                   *
* → Created on : 2025/01/24                                                                                             *
* → Last modif : 2025/01/24                                                                                             *
* → Version    : 1.0.0.0                                                                                                *
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
* This function has 2 argument(s):                                                                                      *
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
function hexaPtsFromCenterByRadius(
  centerPt: {x: number, y: number},
  radius: number
): {x: number, y: number}[] {
  let hexaPtsList: {x: number, y: number}[] = [
    {x: 0, y: 0}, // pt_0
    {x: 0, y: 0}, // pt_1
    {x: 0, y: 0}, // pt_2
    {x: 0, y: 0}, // pt_3
    {x: 0, y: 0}, // pt_4
    {x: 0, y: 0}  // pt_5
  ] ;
  let angle: number = 0 ;
  const angStep: number = 60.0 ;
  const dist: number = radius / Math.cos(angDeg2Rad(angStep / 2.)) ;
  for (let pt of hexaPtsList) {
    pt = polar(centerPt, (angle++)*angStep, dist) ;
  }
  return hexaPtsList;
}