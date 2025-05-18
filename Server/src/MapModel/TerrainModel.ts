export class Terrain{


   public isBuildingEnabled:boolean;
   public isFarmingEnabled:boolean;
   public isWalkingEnabled:boolean;
   public movementCost:number;
   
   public name:string;

   //private linkURI:string;
   //private linkID:number;



   constructor(building:boolean,farming:boolean,walking:boolean,movCost:number,name:string){
      this.isBuildingEnabled = building;
      this.isFarmingEnabled = farming;
      this.isWalkingEnabled = walking;
      this.movementCost = movCost;
      this.name = name;
   }




   //accessor get

   public get _isBuildingEnabled():boolean{
      return this.isBuildingEnabled;
   }

   public get _isFarmingEnabled():boolean{
      return this.isFarmingEnabled;
   }

   public get _isWalkingEnabled():boolean{
      return this.isWalkingEnabled;
   }

   public get _movementCost():number{
      return this.movementCost;
   }

   public get _name():string{
      return this.name
   }

   public equals(that: Terrain): boolean {
      return(
         this.isBuildingEnabled === that.isBuildingEnabled &&
         this.isFarmingEnabled === that.isFarmingEnabled &&
         this.isWalkingEnabled === that.isWalkingEnabled &&
         this.movementCost === that.movementCost &&
         this.name === that.name
      );
   }

}