export interface IAnimated{

   typeAnimation:TypeAnimation;
   spriteSheet:string[];
   northAnim: AnimID[];
   westAnim: AnimID[];
   southAnim: AnimID[];
   eastAnim: AnimID[];

   anime(direction:PointCardinal):void;


}

export enum TypeAnimation{
   RUN = "Run",
   FIGHT = "Fight",
   WALK = "Walk"
}

export enum PointCardinal{
   NORTH,
   SOUTH,
   WEST,
   EAST
}

export type AnimID = number | number[];