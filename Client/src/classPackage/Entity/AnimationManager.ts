import path from "path";
import type * as my from "../Controller/CommonTypes";
import { Point } from "../Math/Point";
import { Unit } from "./Unit";
import { mainScene } from "../..";

type Anima = {
  key: string,
  filename: string,
  faction: my.Factions,
  type: my.AssetsCategories,
  category: my.AllSubCategories,
  name: string,

}

export function AnimationManager(path: string, factions: string[]): Anima[] {
  let aniMan: Anima[] = [];
  return aniMan;
}

function DirExplore(path: string): void {

}

export function addSpriteAndAnimate(
  img: string,
  tile: Point|Phaser.Tilemaps.Tile,
): void {
  const x: number = mainScene._map.tileToWorldX(tile.x) as number;
  const y: number = mainScene._map.tileToWorldY(tile.y) as number;
  var name: string = img.split('/').reverse()[0];
  name = name.substring(0,name.length-".png".length);
  console.log(img,name);
  const tmp: string[] = name.split('_');
  console.log(tmp);
  const unit: string = tmp[1];
  const anim: string = tmp[2];
  const frames: string[] = tmp[3].split('-');
  const fw: number = +frames[0].substring(0,1);
  const fh: number = +frames[0].substring(1,2);
  const aw: number = +frames[1].substring(0,1);
  const ah: number = +frames[1].substring(1,2);

  
	mainScene.load.spritesheet(name, img, {
		frameWidth: 16*fw,
		frameHeight: 16*fh,
	});
  mainScene.anims.create({
    key: unit,
    frameRate: 8,
    repeat: -1
  });
  const helpme = mainScene.add.sprite(x,y,name,0);
  helpme.play(name);
}