import { AssetsEnum } from "./AssetsEnum";

export class SpriteLoaded{
   private id:string;
   private path:string;

   constructor(fileEnum:AssetsEnum){
      this.id = fileEnum.split("/").reverse()[0].split(".")[0];
      this.path = fileEnum;
      console.log(this);

   }

}//fileEnum.split("/").reverse()[0];