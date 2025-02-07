import * as d3 from "d3";
import * as mapMath from "./Map_MathsFunctions";

export function generateSquareMatrix(
  svg: any,
  fromPt: number[],
  nbTilesX: number,
  nbTilesY: number,
  dimTile: number,
): void {
  d3.selectAll("*").remove();
  let nextPt: number[] = fromPt;
  for (let row=0 ; row<nbTilesY ; row++) {
    for (let col=0 ; col<nbTilesX ; col++) {
      svg.append("rect")
        .attr("x",nextPt[0])
        .attr("y",nextPt[1])
        .attr("width",dimTile)
        .attr("height",dimTile)
        .attr("border","1px solid black")
        .attr("id","id_"+col+"."+row);
      nextPt = [nextPt[0]+dimTile,nextPt[1]];
    }
    nextPt = [fromPt[0],fromPt[1]-dimTile];
  }
}

export function helloWorld(){
  let body = document.getElementById("body");
  let hello = document.createElement("h2");
  hello.textContent="hello World";
  body?.appendChild(hello);
}

export function polygonMap(
  svg: any,
  fromPt: [number, number],
  innerCircleRadius: number,
  nbVertex: number,
  nbTilesX: number,
  nbTilesY: number,
): void {
  function polygonPtsToString(polygonPts: Array<[number, number]>): string {
    let str: string = "M ";
    for (let pt of polygonPts) {
      str += pt[0]+","+pt[1]+" " ;
    }
    return str+"Z";
  }
  svg.selectAll("*").remove() ;
  fromPt = [fromPt[0]+innerCircleRadius, fromPt[1]+innerCircleRadius] ;
  const anglePolygon: number = Math.PI/2. - (2*Math.PI / nbVertex) ;
  for (let y=0 ; y<nbTilesY ; y++) {
    var centerPt: [number, number] = mapMath.polar(fromPt, Math.PI/2., 2*innerCircleRadius*y) ;
    for (let x=0 ; x<nbTilesX ; x++) {
      let polygonPts: [number, number][] = mapMath.polygonCircumscribing(centerPt, innerCircleRadius, nbVertex) ;
      console.log(`Polygon x=${x}|y=${y} :`) ;
      for (let i=0 ; i<polygonPts.length ; i++) {
        console.log(`   Pt_${i} = ${polygonPts[i]}`) ;
      }
      let path: string = polygonPtsToString(polygonPts) ;
      console.log(`   -> path: ${path}`) ;
      centerPt = mapMath.polar(centerPt, (x%2==1)?anglePolygon:-anglePolygon, 2*innerCircleRadius) ;
      svg.append("path")
        .attr("class", "map tile")
        .attr("id", "t"+x+","+y)
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width","1");
    }
  }
}