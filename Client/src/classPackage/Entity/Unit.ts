import type { Tile } from "../../Map/Tile";
import { FACTION } from "common";
import type { AnimID, IAnimated, PointCardinal, TypeAnimation } from "./IAnimated";
import type { IEntity } from "./IEntity";


export abstract class Unit implements IEntity, IAnimated {
  
   id: string;
   faction: FACTION;
   coordonnee: Tile;
   typeAnimation: TypeAnimation;
   northAnim: AnimID[];
   westAnim: AnimID[];
   southAnim: AnimID[];
   eastAnim: AnimID[];
   spriteSheet: string[];
   pvMax:number = 100;
   pv:number;


   constructor(
      id:string,faction:FACTION,coordonnee:Tile,

      typeAnimation:TypeAnimation,spriteSheet:string[],
      northAnim:AnimID[],westAnim:AnimID[],southAnim:AnimID[],eastAnim:AnimID[],pv:number = 100){

      this.id = id;
      this.faction = faction;
      this.coordonnee = coordonnee;
      this.typeAnimation = typeAnimation;
      this.spriteSheet = spriteSheet;
      this.northAnim = northAnim;
      this.westAnim = westAnim;
      this.southAnim = southAnim;
      this.eastAnim = eastAnim;
      this.pv = pv;
   }
   
   
   spawn(): void {
      throw new Error("Method not implemented.");
   }
   despawn(): void {
      throw new Error("Method not implemented.");
   }

   
   anime(direction: PointCardinal): void {
      throw new Error("Method not implemented.");
   }

   abstract fight():void;


    

}