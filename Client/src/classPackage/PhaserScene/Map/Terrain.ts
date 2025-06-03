export class Terrain{


   public isBuildingEnabled: boolean;
   public isFarmingEnabled: boolean;
   public isSailingEnabled: boolean;
   public isWalkingEnabled: boolean;
   public isObstacle: boolean;
   public movementCost?: number;
   
   public name:string;

   //private linkURI:string;
   //private linkID:number;



   constructor(
    name: string,
    building: boolean = true,
    farming: boolean = false,
    sailing: boolean = false,
    walking: boolean = true,
    obstacle: boolean = false,
    movCost?: number,
  ){
      this.isBuildingEnabled = building;
      this.isFarmingEnabled = farming;
      this.isSailingEnabled = sailing;
      this.isWalkingEnabled = walking;
      this.isObstacle = obstacle;
      this.movementCost = movCost;
      this.name = name;
   }

   public equals(that: Terrain): boolean {
      return(
         this.isBuildingEnabled === that.isBuildingEnabled &&
         this.isFarmingEnabled === that.isFarmingEnabled &&
         this.isSailingEnabled === that.isSailingEnabled &&
         this.isWalkingEnabled === that.isWalkingEnabled &&
         this.isObstacle === that.isObstacle &&
         this.movementCost === that.movementCost &&
         this.name === that.name
      );
   }

   public merge(that: Terrain): void {
    let updated: boolean = false;
    if(!that.isBuildingEnabled) {this.isBuildingEnabled=that.isBuildingEnabled; updated=true;} // worst taken => FALSE
    if(!that.isFarmingEnabled) {this.isFarmingEnabled=that.isFarmingEnabled; updated=true;} // worst taken => FALSE
    if(!that.isSailingEnabled) {this.isSailingEnabled=that.isSailingEnabled; updated=true;} // worst taken => FALSE
    if(!that.isWalkingEnabled) {this.isWalkingEnabled=that.isWalkingEnabled; updated=true;} // worst taken => FALSE
    else if(that.isWalkingEnabled && !this.isWalkingEnabled) {this.isWalkingEnabled=that.isWalkingEnabled; updated=true;}
    if(that.isObstacle) {this.isObstacle=that.isObstacle; updated=true;} // worst taken => TRUE
    else if(!that.isObstacle && this.isObstacle && this.isWalkingEnabled) {this.isObstacle=that.isObstacle; updated=true;}
    if(that.movementCost) {this.movementCost=that.movementCost; updated=true;} // replace if not UNDEFINED
    if(updated) this.name=that.name;
   }

}