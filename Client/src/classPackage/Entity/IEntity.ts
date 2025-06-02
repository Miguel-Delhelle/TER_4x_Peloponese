import type { Tile } from "../../Map/Tile";
import { FACTION } from "common";


export interface IEntity{
   id:string;
   faction:FACTION;
   coordonnee:Tile;   

   spawn():void;

   despawn():void;

}