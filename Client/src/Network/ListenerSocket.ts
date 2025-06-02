import { HTML } from "..";
import { addPlayer, removePlayer } from "../scp_mainMenu";
import type { IPlayer } from "common";



export function startListenerSocket(): void {

  HTML.socket?.on("player-joined", (player: IPlayer) => {
    if(player) addPlayer(player);
  });

  HTML.socket?.on("player-left", (player: IPlayer) => {
    if(player) removePlayer(player);
  })

}