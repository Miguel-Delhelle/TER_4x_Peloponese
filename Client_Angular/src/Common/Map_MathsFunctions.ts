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
export function polar(
    fromPt: [number, number],
    angle: number,
    distance: number
  ): [number, number] {
  return [
    Math.round((fromPt[0] + distance * Math.cos(angle)) * 1e6) / 1e6,
    Math.round((fromPt[1] + distance * Math.sin(angle)) * 1e6) / 1e6,
  ];
}

function getPtListForSquare(
  fromPt: [number, number],
  dim:number
): [number, number][] {
  let pt1: [number, number] = fromPt;
  let pt2: [number, number] = [fromPt[0]+dim,fromPt[1]];
  let pt3: [number, number] = [fromPt[0]+dim,fromPt[1]-dim];
  let pt4: [number, number] = [fromPt[0],fromPt[1]-dim];
  let ptList: [number, number][] = [pt1,pt2,pt3,pt4];
  return ptList;
}

export function polygonCircumscribing(
  centerPt: [number, number],
  innerCircleRadius: number,
  nbVertex: number,
): Array<[number, number]> {
  const angleBetweenAxe: number = 2*Math.PI / nbVertex ;
  const angleMidAxe: number = angleBetweenAxe / 2. ;
  const angleStart: number = angleMidAxe + Math.PI/2 ;
  const dimensionAxe: number = innerCircleRadius / Math.cos(angleMidAxe) ;
  let polygonPts: Array<[number, number]> = new Array<[number, number]>(nbVertex);
  for (let i=0 ; i<nbVertex ; i++) {
    polygonPts[i] = polar(centerPt, i*angleBetweenAxe+angleStart, dimensionAxe) ;
  }
  return polygonPts ;
}