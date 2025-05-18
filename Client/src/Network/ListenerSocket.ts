import { roomDisplay, socket } from "..";

export function startListenerSocket(){
   socket!.on("playerJoined", (response:any) => {
     console.log("socket on playerJoined data",response);
     const tabOfRoomInfo:string[] = response.tabOfRoomInfo;
     roomDisplay(tabOfRoomInfo);
   })

   
 }