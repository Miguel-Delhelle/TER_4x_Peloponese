
//                                      -  -- Imports --  -                                      //
import { HTML } from ".";
import type { GameRoom, Player } from ".";
//import { Player } from "./classPackage/Player/player";
import io from "socket.io-client";
import { startListenerSocket } from "./Network/ListenerSocket";

// ----------------------------------------[ MainMenu ]----------------------------------------- //
// |                                                                                           | //
// +-------------------------------------------------------------------------------------------+ //
//                               -  -- Block-Variables [mm_] --  -                               //

const section: HTMLElement|null = document.querySelector("#MainMenu");
if(!section) throw Error("MainMenu does not exist...");

const btnHost = section.querySelector(`#btn-host`) as HTMLButtonElement;
const dbRoom = section.querySelector(`#db-room`) as HTMLDivElement;
const txtRoom = dbRoom.querySelector(`#txt-room`) as HTMLParagraphElement;
const selCity = dbRoom.querySelector(`#sel-city`) as HTMLSelectElement;
const optCity = selCity.querySelectorAll('option') as NodeListOf<HTMLOptionElement>;
const player1 = dbRoom.querySelector(`#player-1`) as HTMLUListElement;
const player2 = dbRoom.querySelector(`#player-2`) as HTMLUListElement;
const player3 = dbRoom.querySelector(`#player-3`) as HTMLUListElement;
const btnReady = dbRoom.querySelector(`#btn-ready`) as HTMLButtonElement;

const btnJoin = section.querySelector(`#btn-join`) as HTMLButtonElement;
const dbJoin = section.querySelector(`#db-join`) as HTMLDivElement;
const inpRoom = dbJoin.querySelector(`#inp-room`) as HTMLInputElement;
const btnJoinRoom = dbJoin.querySelector(`#btn-join-room`) as HTMLButtonElement;

const btnProfile = section.querySelector(`#btn-profile`) as HTMLButtonElement;
const txtProfile = section.querySelector(`#txt-username`) as HTMLHeadingElement;
const dbProfile = section.querySelector(`#db-profile`) as HTMLDivElement;
const inpMail = dbProfile.querySelector(`#inp-mail`) as HTMLInputElement;
const inpUsername = dbProfile.querySelector(`#inp-username`) as HTMLInputElement;
const inpPassword = dbProfile.querySelector(`#inp-password`) as HTMLInputElement;
const txtError = dbProfile.querySelector(`#txt-error`) as HTMLParagraphElement;
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

function errorOnRegisterLogin(isRegister: boolean): boolean {
  HTML.toggleClass(inpMail, 'error', !inpMail.value.match(/\w+@\w+/g));
  HTML.toggleClass(inpUsername, 'error', isRegister&&!inpUsername.value.match(/\w+/g));
  HTML.toggleClass(inpPassword, 'error', !inpPassword.value.match(/\S+/g));
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
  if(errorOnRegisterLogin(true)) return;
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
  if(errorOnRegisterLogin(false)) return;
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
        console.log(`Succesfully logged in as: ${HTML.currentUser}`);
        HTML.toggleDisabled([btnHost, btnJoin], false);
        clearOnRegisterLogin(false);
        HTML.toggleClass(dbProfile, 'hidden');
        startEventListener;
        startListenerSocket;
      }
    } catch (error) {
      clearOnRegisterLogin(true);
      console.error(error);
    }
  } else {
    txtProfile.textContent = HTML.currentUser as string|null ?? HTML.defaultUser;
    clearOnRegisterLogin(true);
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

// ToDo!!
function updateCitySelector(): void {
  [player1, player2, player3].filter(p => p.getAttribute('data-player')!=txtProfile.textContent).forEach(p => {
    if(p.hasAttribute('data-city')) {
      optCity.forEach(opt => {
        if(opt.textContent === p.getAttribute('data-city')) HTML.toggleDisabled(opt, true);
      });
    }
  });
}


// +-------------------------------------------------------------------------------------------+ //
//                                -  -- Block-EventListener --  -                                //

section?.addEventListener("click", event => {
  const triggerElements: Node[] = [
    btnHost, dbRoom,
    btnJoin, dbJoin,
    btnProfile, dbProfile
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
btnProfile.addEventListener("click", () => {console.log(dbProfile);HTML.toggleClass(dbProfile, 'hidden');});

btnRegister.addEventListener("click", handleRegister);
btnLogin.addEventListener("click", handleLogin);
btnLogin.addEventListener("mouseenter", () => {HTML.toggleDisabled(inpUsername, true);});
btnLogin.addEventListener("mouseleave", () => {HTML.toggleDisabled(inpUsername, false);});

imgMascot.addEventListener("click", HTML.startGame);

function startEventListener(): void {

  btnHost.addEventListener("click", async () => {
    if(!dbRoom.classList.contains('hidden')) {
      HTML.socket?.emit("hostRoom", (roomInfo:string[]) => {
        HTML.currentRoom = {
          id: roomInfo[0],
          player1: HTML.currentUser as Player|null,
          player2: null,
          player3: null
        }
        updateRoomInfo(HTML.currentRoom);
      });
    }
  });

  btnJoinRoom.addEventListener("click", async () => {
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
    })
  });
  
  btnReady.addEventListener("click", handleReady);

}

// |                                                                                           | //
// -------------------------------------------[ END ]------------------------------------------- //
}

export function updateRoomInfo(data: GameRoom): void {
  try {
    txtRoom.textContent = data.id;
    const 
      p1: string|undefined = data.player1?.username,
      p2: string|undefined = data.player2?.username,
      p3: string|undefined = data.player3?.username
    ;
    const pad: number = Math.max(p1?p1.length:0, p2?p2.length:0, p3?p3.length:0);
    player1.textContent = p1?`${p1.padEnd(pad)} -> ${data.player1?.faction ?? '[is selecting...]'}`:'';
    player2.textContent = p2?`${p2.padEnd(pad)} -> ${data.player2?.faction ?? '[is selecting...]'}`:'';
    player3.textContent = p3?`${p3.padEnd(pad)} -> ${data.player3?.faction ?? '[is selecting...]'}`:'';
  } catch(err) {
    console.log(err);
    [player1, player2, player3].forEach(p => p.textContent = '');
  }
}