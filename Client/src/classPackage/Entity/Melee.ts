import { Unit } from "./Unit";
import { Tile} from "../PhaserScene/Map/Tile";
import type { AnimID } from "./IAnimated";
import { TypeAnimation } from "./IAnimated";

export class Melee extends Unit{


   constructor(id:string,faction:string,coordonnee:Tile,
         typeAnimation:TypeAnimation,spriteSheet:string[],
         northAnim:AnimID[],westAnim:AnimID[],southAnim:AnimID[],eastAnim:AnimID[],pv:number = 100){
      
      
            super(id,faction,coordonnee,typeAnimation,spriteSheet,northAnim,westAnim,southAnim,eastAnim,pv)


   }

   

   fight(): void {
      throw new Error("Method not implemented.");
   }
   
}