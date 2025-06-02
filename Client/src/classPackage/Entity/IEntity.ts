import type { Tile } from "../../Map/Tile";
import { FACTION } from "common";


export interface IEntity{
   id:string;
   faction:string;
   coordonnee:Tile;   

   spawn():void;

   despawn():void;

}