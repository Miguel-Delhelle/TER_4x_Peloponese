import type { Tile } from "../PhaserScene/Map/Tile";
import type { FACTION } from "./EFaction";

export interface IEntity{
   id:string;
   faction:FACTION;
   coordonnee:Tile;   

   spawn():void;

   despawn():void;

}