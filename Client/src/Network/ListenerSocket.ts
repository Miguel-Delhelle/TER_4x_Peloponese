import { HTML } from "..";
import { updateRoomInfo } from "../scp_mainMenu";

export function startListenerSocket(): void {
  HTML.socket?.on("playerJoined", (response:any) => {
    console.log("socket on playerJoined data",response);
    updateRoomInfo(response.tabOfRoomInfo);
  })
}