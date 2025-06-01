import { HTML } from "..";
import { updateRoomInfo } from "../scp_mainMenu";
import type { GameRoom } from "..";

export function startListenerSocket(): void {
  HTML.socket?.on("playerJoined", (response: GameRoom) => {
    updateRoomInfo(response);
  })
}