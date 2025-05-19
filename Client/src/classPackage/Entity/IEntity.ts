import type { Tile } from "../PhaserScene/Map/Tile";
import type { FACTION } from "./EFaction";

export interface IEntity{
   id:string;
   faction:string;
   coordonnee:Tile;   

   spawn():void;

   despawn():void;

}