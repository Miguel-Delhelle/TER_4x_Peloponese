
//                                      -  -- Imports --  -                                      //
import { HTML } from ".";
import type { GameRoom, Player } from ".";
//import { Player } from "./classPackage/Player/player";
import io from "socket.io-client";
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
const player1 = divP1.querySelector(`#player-1`) as HTMLTextElement;
const divP2 = dbRoom.querySelector(`#div-p2`) as HTMLDivElement;
const player2 = divP2.querySelector(`#player-2`) as HTMLTextElement;
const divP3 = dbRoom.querySelector(`#div-p3`) as HTMLDivElement;
const player3 = divP3.querySelector(`#player-3`) as HTMLTextElement;
const players = dbRoom.querySelector(`#players`) as HTMLTextElement;
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
  txtProfile.textContent = HTML.currentUser as string|null;
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
  if (res.ok) {
    alert(`Welcome on board ${inpUsername.value} !`);
  }
  else {
    alert(`An error occured during your registration..`);
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
  if (res.ok) {
    try {
      const data = await res.json();
      HTML.currentUser = data.username as string;

      txtProfile.textContent = HTML.currentUser;
      HTML.toggleClass(txtProfile, 'disabled', false);
      HTML.socket = io(HTML.URI);
      if(HTML.socket) {
        HTML.socket.emit("loginOk",{idUser: data.id});
        HTML.currentUser = {username: HTML.currentUser, socket: HTML.socket};
        console.log(`Succesfully logged in as: ${HTML.currentUser.username}`);
        HTML.toggleDisabled([btnHost, btnJoin], false);
        clearOnRegisterLogin(false);
        HTML.toggleClass(dbProfile, 'hidden');
        startEventListener();
        startListenerSocket();
      }
    } catch (error) {
      clearOnRegisterLogin(true);
      errorOnRegisterLogin({mail: true, password: true});
      console.error(error);
    }
  } else {
    txtProfile.textContent = HTML.currentUser as string|null ?? HTML.defaultUser;
    clearOnRegisterLogin(true);
    errorOnRegisterLogin({mail: true, password: true});
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
  if([player1, player2, player3].every(p => p.getAttribute('data-player') && p.getAttribute('data-city'))) HTML.startGame;
}

async function handleCharacterPick(event: Event): Promise<void> {
  let pick: HTMLDivElement;
  let play: HTMLParagraphElement;
  let unpick: HTMLDivElement[] = [divP1,divP2,divP3];
  let unplay: HTMLParagraphElement[] = [player1,player2,player3];
  if(event.target as Node === divP1 as Node) {
    pick = divP1;
    unpick = [divP2,divP3];
    play = player1;
    unplay = [player2,player3]
  } else if(event.target as Node === divP2 as Node) {
    pick = divP2;
    unpick = [divP1,divP3];
    play = player2;
    unplay = [player1,player3]
  } else if(event.target as Node === divP3 as Node) {
    pick = divP3;
    unpick = [divP1,divP2];
    play = player3;
    unplay = [player1,player2]
  } else return;
  play.textContent = (HTML.currentUser as Player).username;
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
    HTML.toggleClass([dbRoom, dbJoin, dbProfile], 'hidden', true);
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

  async function handleHost(): Promise<void> {
    if(!dbRoom.classList.contains('hidden')) {
      HTML.socket?.emit("hostRoom", (roomInfo: GameRoom) => {
        HTML.currentRoom = roomInfo;
        updateRoomInfo(roomInfo);
      });
    }
  }

  async function handleJoin(): Promise<void> {
    HTML.socket?.emit("joinRoom", { roomId: inpRoom.value }, (response:GameRoom|Error) => {
      try {
        if(response instanceof Error) throw response;
        HTML.toggleClass(dbJoin, 'hidden', true);
        HTML.toggleClass(dbRoom, 'hidden', false);
        updateRoomInfo(response);
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

export function updateRoomInfo(data: GameRoom): void {
  try {
    txtRoom.textContent = data.id;
    const playersInRoom: Player[] = data.players;
    players.textContent = "Players: ";
    playersInRoom.forEach(p => {
      if(p) {
        const u: string = p.username;
        const f: string|undefined = p.faction;
        players.textContent += `${u} `;
        if(f) {
          switch (f) {
            case "ATHENS":
              player1.textContent = u;
              HTML.toggleClass(divP1,'disabled',true);
              break;
            case "SPARTA":
              player2.textContent = u;
              HTML.toggleClass(divP2,'disabled',true);
              break;
            case "THEBES":
              player3.textContent = u;
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