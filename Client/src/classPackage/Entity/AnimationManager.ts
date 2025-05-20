import path from "path";
import type * as my from "../Controller/CommonTypes";
import { Point } from "../Math/Point";
import { Unit } from "./Unit";

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

export function addSpriteAndAnimate(
  scene: Phaser.Scene,
  img: string,
  tile: Point|Phaser.Tilemaps.Tile,
): void {
  const x: number = tile.x;
  const y: number = tile.y;
  const name: string = path.basename(img,".png");
  const tmp: string[] = name.split('_');
  const unit: string = tmp[1];
  const anim: string = tmp[2];
  const frames: string[] = tmp[3].split('-');
  const fw: number = +frames[0].substring(0,1);
  const fh: number = +frames[0].substring(1,2);
  const aw: number = +frames[1].substring(0,1);
  const ah: number = +frames[1].substring(1,2);

  
	scene.load.spritesheet(name, img, {
		frameWidth: 16*fw,
		frameHeight: 16*fh,
	});
  scene.anims.create({
    key: unit,
    frameRate: 8,
    repeat: -1
  });
  const helpme = scene.add.sprite(x,y,name,0);
  helpme.play(name);
}