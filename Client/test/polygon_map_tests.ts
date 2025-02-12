import * as d3 from 'd3';
import { polygonMap } from '../src/Map/Map_GenerativeFunctions';

type TestParams = {
  fromPt: [number, number];
  innerCircleRadius: number;
  nbVertex: 4 | 6;
  nbTilesX: number;
  nbTilesY: number;
};

const testCases: TestParams[] = [
  { fromPt: [0, 0], innerCircleRadius: 20, nbVertex: 4, nbTilesX: 5, nbTilesY: 5 },
  { fromPt: [0, 0], innerCircleRadius: 30, nbVertex: 4, nbTilesX: 7, nbTilesY: 7 },
  { fromPt: [0, 0], innerCircleRadius: 40, nbVertex: 6, nbTilesX: 6, nbTilesY: 6 },
  { fromPt: [0, 0], innerCircleRadius: 50, nbVertex: 6, nbTilesX: 8, nbTilesY: 8 },
];

document.addEventListener('DOMContentLoaded', () => {
  const container = d3.select('body').append('div').attr('id', 'maps-container');

  testCases.forEach((test, index) => {
    const svg = container.append('svg')
      .attr('width', 600)
      .attr('height', 600)
      .style('border', '1px solid black');
    
    polygonMap(svg, test.fromPt, test.innerCircleRadius, test.nbVertex, test.nbTilesX, test.nbTilesY);
  });
});