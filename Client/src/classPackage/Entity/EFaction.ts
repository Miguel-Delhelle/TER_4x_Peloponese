export enum FACTION{
   OTHER = "Others",
   SPARTA = "Sparta",
   ATHENS = "Athens",
   THEBES = "Thebes",
   WILDERNESS = "Wilderness"
}

export function parseEnum<T extends object>(enumObj: T,key: string): T[keyof T] | undefined {
  
   
   return (enumObj as any)[key];
}