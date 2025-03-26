/* intégrer le code dans /src, /controllers */

import * as EasyStar from 'easystarjs';
import easystarjs from 'easystarjs';
import Phaser from "phaser";
import { MainScene } from "../PhaserScene/MainScene";

import { ToolsController } from "../Controller/ToolsController.ts";
import { Unit } from "../Entity/units/Unit.ts";
import { MapController } from "../Controller/MapController.ts";


export class Pathfinding {
    private pathfinder: EasyStar.js;
    private grid: number[][];
    private pathCache: Map<string, any>;

    constructor(scene:MainScene, grid: number[][]) {
      
        this.pathfinder = new EasyStar.js();
        this.grid = grid;
        this.pathfinder.setGrid(grid);
        this.pathfinder.setAcceptableTiles([0]);
        this.pathfinder.enableDiagonals();
        this.pathCache = new Map<string, any>(); 
    }

/* FONCTION POUR CALCULER LE CHEMIN */

    findPath(start: { x: number, y: number }, end: { x: number, y: number }, 
      callback: (path: { x: number, y: number }[] | null) => void) {
      const key = `${start.x},${start.y}-${end.x},${end.y}`;
      if (this.pathCache.has(key)) {
          callback(this.pathCache.get(key));
          console.log("Chemin trouvé dans le cache");
          return;
      }
      this.pathfinder.findPath(start.x, start.y, end.x, end.y, (path) => {
          if (path) this.pathCache.set(key, path);
          callback(path);
          console.log("Chemin calculé");
      });
      this.pathfinder.calculate();
  }

}