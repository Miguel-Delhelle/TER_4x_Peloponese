import type { GreekMap } from "../PhaserScene/Map/GreekMap";
import { Terrain } from "../PhaserScene/Map/Terrain";
import type { Tile } from "../PhaserScene/Map/Tile";

export class PathFinder {
    private grid: number[][] = [];
    private landscapeLayer?: Phaser.Tilemaps.TilemapLayer;

    constructor(private map: Phaser.Tilemaps.Tilemap, private layers: Phaser.Tilemaps.TilemapLayer[], private greekMap: GreekMap) {
      this.initGrid(greekMap);
    }

    public initGrid(map: GreekMap): void {
      const width = this.map.width;
      const height = this.map.height;
      this.grid = map.staticMatrice.map(line => line.map(tile => tile.terrain.movementCost as number));
      /*
      this.grid = Array(height).fill(0).map(() => Array(width).fill(Infinity));
      this.landscapeLayer = this.layers.find(l => l.name.endsWith('Landscape'));
      if (this.landscapeLayer) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const tile = this.map.getTileAt(x, y, true, this.landscapeLayer);
            if (tile && tile.properties && tile.properties.IsWalkingEnabled) {
              this.grid[y][x] = tile.properties.MovementCost ?? 1;
            }
          }
        }
      }*/
    }

     /* ------------------------------------------- FINDPATH ------------------------------------------- */

  public findPathAStar(startX: number, startY: number, endX: number, endY: number, mode: 'land'|'sea' = 'land'): { path: { x: number, y: number }[], cost: number } | null {
    const width = this.map.width;
    const height = this.map.height;
    const openSet: { x: number, y: number, g: number, f: number, parent?: { x: number, y: number } }[] = [];
    const cameFrom: (null | { x: number, y: number })[][] = Array(height).fill(null).map(() => Array(width).fill(null));
    const gScore: number[][] = Array(height).fill(null).map(() => Array(width).fill(Infinity));
    const closedSet: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

    function heuristic(x: number, y: number) {
        return Math.abs(x - endX) + Math.abs(y - endY);
    }

    gScore[startY][startX] = 0;
    openSet.push({ x: startX, y: startY, g: 0, f: heuristic(startX, startY) });

    while (openSet.length > 0) {
        // Prend le noeud avec le plus petit f
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift()!;
        const { x, y } = current;

        if (x === endX && y === endY) {
            // Reconsitution du chemin
            const path = [];
            let cx = x, cy = y;
            while (cameFrom[cy][cx]) {
                path.push({ x: cx, y: cy });
                const prev = cameFrom[cy][cx]!;
                cx = prev.x;
                cy = prev.y;
            }
            path.push({ x: startX, y: startY });
            path.reverse();
            return { path, cost: gScore[endY][endX] };
        }

        closedSet[y][x] = true;

        const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 }
        ];

        for (const neighbor of neighbors) {
            const nx = neighbor.x, ny = neighbor.y;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            if (closedSet[ny][nx]) continue;
            let tile: Terrain = this.greekMap.staticMatrice[nx][ny].terrain;
            tile = Object.assign(new Terrain(""),tile);
            const obj = this.greekMap.dynamicMatrice[nx][ny];
            if(obj) tile.merge(obj.terrain);
            //if (!tile || !tile.properties || !tile.properties.IsWalkingEnabled) continue;
            if((mode==='land' && (!tile.isWalkingEnabled || tile.isObstacle)) || (mode==='sea' && (!tile.isSailingEnabled || tile.isObstacle))) continue;
            const tentative_gScore = gScore[y][x] + (this.grid[ny][nx] || 1);
            if (tentative_gScore < gScore[ny][nx]) {
                cameFrom[ny][nx] = { x, y };
                gScore[ny][nx] = tentative_gScore;
                const fScore = tentative_gScore + heuristic(nx, ny);
                if (!openSet.some(n => n.x === nx && n.y === ny)) {
                    openSet.push({ x: nx, y: ny, g: tentative_gScore, f: fScore });
                }
            }
        }
    }

    // Aucun chemin trouvé
    return null;
}
}