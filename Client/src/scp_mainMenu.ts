
//                                      -  -- Imports --  -                                      //
import { HTML } from ".";
import { FACTION, type IGameRoom,type IPlayer, type ResponseLogin, type ResponseRegister } from "common";
import { printMessage } from "common";
import { io } from "socket.io-client";
import { startListenerSocket } from "./Network/ListenerSocket";

type HTMLTextElement = HTMLParagraphElement|HTMLHeadingElement;
// ----------------------------------------[ MainMenu ]----------------------------------------- //
// |                                                                                           | //
// +-------------------------------------------------------------------------------------------+ //
//                               -  -- Block-Variables [mm_] --  -                               //

const section: HTMLElement|null = document.querySelector("#MainMenu");
if(!section) throw Error("MainMenu does not exist...");

const btnHost = section.querySelector(`#btn-host`) as HTMLButtonElement;
const dbRoom = section.querySelector(`#db-room`) as HTMLDivElement;
const txtRoom = dbRoom.querySelector(`#txt-room`) as HTMLTextElement;
const divP1 = dbRoom.querySelector(`#div-p1`) as HTMLDivElement;
const txtplayer1 = divP1.querySelector(`#player-1`) as HTMLTextElement;
const divP2 = dbRoom.querySelector(`#div-p2`) as HTMLDivElement;
const txtplayer2 = divP2.querySelector(`#player-2`) as HTMLTextElement;
const divP3 = dbRoom.querySelector(`#div-p3`) as HTMLDivElement;
const txtplayer3 = divP3.querySelector(`#player-3`) as HTMLTextElement;
const txtplayers = dbRoom.querySelector(`#players #players-list`) as HTMLSpanElement;
const btnReady = dbRoom.querySelector(`#btn-ready`) as HTMLButtonElement;

const btnJoin = section.querySelector(`#btn-join`) as HTMLButtonElement;
const dbJoin = section.querySelector(`#db-join`) as HTMLDivElement;
const inpRoom = dbJoin.querySelector(`#inp-room`) as HTMLInputElement;
const btnJoinRoom = dbJoin.querySelector(`#btn-join-room`) as HTMLButtonElement;

const imgProfile = section.querySelector(`#img-profile`) as HTMLImageElement;
const txtProfile = section.querySelector(`#txt-username`) as HTMLTextElement;
const dbProfile = section.querySelector(`#db-profile`) as HTMLDivElement;
const inpMail = dbProfile.querySelector(`#inp-mail`) as HTMLInputElement;
const inpUsername = dbProfile.querySelector(`#inp-username`) as HTMLInputElement;
const inpPassword = dbProfile.querySelector(`#inp-password`) as HTMLInputElement;
const txtError = dbProfile.querySelector(`#txt-error`) as HTMLTextElement;
const btnLogin = dbProfile.querySelector(`#btn-login`) as HTMLButtonElement;
const btnRegister = dbProfile.querySelector(`#btn-register`) as HTMLButtonElement;

const imgMascot = section.querySelector(`#img-mascot`) as HTMLImageElement;


export function startMainMenu(): void {
// +-------------------------------------------------------------------------------------------+ //
//                               -  -- Block-Functions [mm_] --  -                               //

// ToDo!!
function initMainMenu(): void {
  txtProfile.textContent = HTML.currentUser?.username ?? HTML.defaultUser;
  HTML.toggleClass(txtProfile, 'disabled', true);
  HTML.toggleDisabled([btnHost, btnJoin], true);
} initMainMenu();

function errorOnRegisterLogin(config?: {mail?: boolean, username?: boolean, password?: boolean}): boolean {
  HTML.toggleClass(inpMail, 'error', config?.mail===undefined?!inpMail.value.match(/\w+@\w+/g):config.mail);
  HTML.toggleClass(inpUsername, 'error', config?.username===undefined?!inpUsername.value.match(/\w+/g):config.username);
  HTML.toggleClass(inpPassword, 'error', config?.password===undefined?!inpPassword.value.match(/\S+/g):config.password);
  if(![inpMail, inpUsername, inpPassword].every(e => !e.classList.contains('error'))) {
    txtError.textContent = 'Incorrect information, please check errors above';
    HTML.toggleClass(txtError, 'hidden', false);
    return true;
  }
  txtError.textContent = '';
  HTML.toggleClass(txtError, 'hidden', true);
  return false;
}

function clearOnRegisterLogin(hasFailed: boolean): void {
  if(hasFailed) inpPassword.value = '';
  else [inpMail, inpUsername, inpPassword].forEach(e => e.value='');
}

async function handleRegister(): Promise<void> {
  if(errorOnRegisterLogin()) {
    clearOnRegisterLogin(true);
    return;
  }
  const res: Response = await fetch(`/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mail: inpMail.value,
      username: inpUsername.value,
      password: inpPassword.value
    })
  });
  const data: ResponseRegister = await res.json();
  if (res.status===200) {
    alert(`${data.msg}\nWelcome on board ${data.user?.username} !`);
  } else if(res.status===500) {
    alert([
      `ERROR: ${data.error}`,
      "See below for more information:",
      data.mail?"  MISSING -> mail":null,
      data.username?"  MISSING -> username":null,
      data.password?"  MISSING -> password":null,
      !(data.mail||data.username||data.password)?"  SERVER -> Internal Server error":null,
    ].filter(Boolean).join('\n'));
  }
  clearOnRegisterLogin(true);
}

async function handleLogin(): Promise<void> {
  if(errorOnRegisterLogin({username: false})) {
    clearOnRegisterLogin(true);
    return;
  }
  const res: Response = await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mail: inpMail.value,
      password: inpPassword.value
    })
  });
  const data: ResponseLogin = await res.json();
  if (res.status===200) {
    try {
      txtProfile.textContent = data.user!.username;
      HTML.toggleClass(txtProfile, 'disabled', false);
      HTML.socket = io(HTML.URI);
      HTML.socket.emit("login", data.user!.mail, (response:any) => {
        if(response.ok) {
          HTML.currentUser = response.user as IPlayer;
          printMessage(`Succesfully logged in as: ${HTML.currentUser.username}`,'info');
          HTML.toggleDisabled([btnHost, btnJoin], false);
          clearOnRegisterLogin(false);
          HTML.toggleClass(dbProfile, 'hidden');
          startEventListener();
          startListenerSocket();
        } else {
          printMessage("An error occurred during the login verification...",'warn');
          console.log(response);
        }
      });
    } catch (err) {
      clearOnRegisterLogin(true);
      errorOnRegisterLogin({mail: true, username: false, password: true});
      printMessage(err as string,'error');
    }
  } else {
    txtProfile.textContent = HTML.currentUser?.username ?? HTML.defaultUser;
    clearOnRegisterLogin(true);
    errorOnRegisterLogin({mail: true, username: false, password: true});
  }
}

// ToDo!!
function handleReady(): void {
  /*
  const playerName = txtProfile.textContent as string;
  const playerSpot = dbRoom.querySelector(`[data-player='${playerName}']`) as HTMLUListElement;
  if(!playerSpot.hasAttribute('data-city')) {
    playerSpot.setAttribute('data-city', selCity.value);
    HTML.socket?.emit("isReadyToPlay", {});
  } else {
    playerSpot.attributes.removeNamedItem('data-city');
    HTML.socket?.emit("isReadyToPlay", {player: playerName, city: ''});
  }*/
  if([txtplayer1, txtplayer2, txtplayer3].every(p => p.getAttribute('data-player') && p.getAttribute('data-city'))) HTML.startGame;
}

function handleCharacterPick(event: Event): void {
  let pick: HTMLDivElement;
  let play: HTMLParagraphElement;
  let unpick: HTMLDivElement[] = [divP1,divP2,divP3];
  let unplay: HTMLParagraphElement[] = [txtplayer1,txtplayer2,txtplayer3];
  if(event.target as Node === divP1 as Node) {
    pick = divP1;
    unpick = [divP2,divP3];
    play = txtplayer1;
    unplay = [txtplayer2,txtplayer3]
  } else if(event.target as Node === divP2 as Node) {
    pick = divP2;
    unpick = [divP1,divP3];
    play = txtplayer2;
    unplay = [txtplayer1,txtplayer3]
  } else if(event.target as Node === divP3 as Node) {
    pick = divP3;
    unpick = [divP1,divP2];
    play = txtplayer3;
    unplay = [txtplayer1,txtplayer2]
  } else return;
  play.textContent = (HTML.currentUser as IPlayer).username;
  HTML.toggleClass(unpick,'disabled',true);
}


// +-------------------------------------------------------------------------------------------+ //
//                                -  -- Block-EventListener --  -                                //

section?.addEventListener("click", event => {
  const triggerElements: Node[] = [
    btnHost, dbRoom,
    btnJoin, dbJoin,
    imgProfile, dbProfile
  ];
  const target = event.target as Node;
  // Hide all the dialog-boxes through the 'hidden' class
  if(triggerElements.every(e => !e.contains(target))) {
    event.stopPropagation();
    HTML.toggleClass([dbJoin, dbProfile], 'hidden', true);
  }
});

btnHost.addEventListener("click", () => {HTML.toggleClass(dbRoom, 'hidden');});
btnJoin.addEventListener("click", () => {HTML.toggleClass(dbJoin, 'hidden');});
imgProfile.addEventListener("click", () => {HTML.toggleClass(dbProfile, 'hidden');});

btnRegister.addEventListener("click", handleRegister);
btnLogin.addEventListener("click", handleLogin);
btnLogin.addEventListener("mouseenter", () => {HTML.toggleDisabled(inpUsername, true);});
btnLogin.addEventListener("mouseleave", () => {HTML.toggleDisabled(inpUsername, false);});

imgMascot.addEventListener("click", HTML.startGame);

function startEventListener(): void {

  function handleHost(): void {
    if(!dbRoom.classList.contains('hidden')) {
      btnHost.textContent = "Leave Room";
      HTML.socket?.emit("room-host", (response:any) => {
        if(response.ok) {
          HTML.currentRoom = response.room as IGameRoom;
          updateRoomInfo(HTML.currentRoom);
        } else {
          printMessage("An error occurred when creating a room...",'warn');
        }
      });
    } else if(HTML.currentRoom) {
      btnHost.textContent = "New Game";
      HTML.socket?.emit("room-leave", HTML.currentRoom.id, (response) => {
        //toDo!!
        if(response.ok) {
          console.log("you left the room");
        }
      });
    }
  }

  function handleJoin(): void {
    HTML.socket?.emit("room-join", inpRoom.value, (response) => {
      try {
        if(response.ok) {
          HTML.currentRoom = response.room as IGameRoom;
          HTML.toggleClass(dbJoin, 'hidden', true);
          HTML.toggleClass(dbRoom, 'hidden', false);
          btnHost.textContent = "Leave Room";
          updateRoomInfo(HTML.currentRoom);
        }
        if(response.error) alert(response.error);
      } catch(err) {
        console.log(err);
        alert(err);
      }
    });
  }

  btnHost.addEventListener("click", handleHost);

  btnJoinRoom.addEventListener("click", handleJoin);

  [divP1,divP2,divP3].forEach(btn => {
    btn.addEventListener("click", e => {handleCharacterPick(e);});
  })
  
  btnReady.addEventListener("click", handleReady);

}

// |                                                                                           | //
// -------------------------------------------[ END ]------------------------------------------- //
}

const sep: string = ', ';
export function updateRoomInfo(data: IGameRoom): void {
  try {
    txtRoom.textContent = data.id;
    const playersInRoom: IPlayer[] = data.players;
    txtplayers.textContent = playersInRoom.map(p => p.username).join(sep);
    playersInRoom.forEach(p => {
      if(p) {
        const u: string = p.username;
        const f: FACTION = p.faction;
        if(f) {
          switch (f) {
            case FACTION.ATHENS:
              txtplayer1.textContent = u;
              HTML.toggleClass(divP1,'disabled',true);
              break;
            case FACTION.SPARTA:
              txtplayer2.textContent = u;
              HTML.toggleClass(divP2,'disabled',true);
              break;
            case FACTION.THEBES:
              txtplayer3.textContent = u;
              HTML.toggleClass(divP3,'disabled',true);
              break;
            default:
          }
        }
      }
    })
  } catch(err) {
    console.log(err);
  }
}

export function addPlayer(player: IPlayer): void {
  txtplayers.textContent += sep+player.username;
}

export function removePlayer(player: IPlayer): boolean {
  const name: string = player.username;
  if(txtplayers.textContent?.includes(name)) {
    txtplayers.textContent = txtplayers.textContent
      .split(sep)
      .map(p => p.trim())
      .filter(p => p!=name)
      .join(sep);
    return true;
  }
  return false;
}