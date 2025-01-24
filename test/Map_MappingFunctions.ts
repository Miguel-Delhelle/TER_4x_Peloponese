function hexagonMapping(
  fromPt: {x: number, y: number},
  nbTilesX: number,
  nbTilesY: number,
  innerCircleTileRadius: number,
): void {
  var centerPt: {x: number, y: number} = fromPt ;
  const dist: number = innerCircleTileRadius * 2 ;
  const ang: number = 30. ;
  for (let row=0; row<nbTilesY; row++) {
    centerPt = polar(fromPt,-90,dist*row) ;
    for (let col=0; col<nbTilesX; col++) {
      hexaPtsFromCenterByRadius(centerPt, innerCircleTileRadius)
      centerPt = polar(centerPt,(col%2==1)?-ang:ang,dist) ;
    }
  }
}