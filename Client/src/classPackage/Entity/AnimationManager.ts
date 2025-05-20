import path from "path";
import type * as my from "../Controller/CommonTypes";

type Anima = {
  key: string,
  filename: string,
  faction: my.Factions,
  type: my.AssetsCategories,
  category: my.AllSubCategories,
  name: string,

}

export function AnimationManager(scene: Phaser.Scene, path: string, factions: string[]): Anima[] {
  let aniMan: Anima[] = [];
  return aniMan;
}

function DirExplore(path: string): void {

}