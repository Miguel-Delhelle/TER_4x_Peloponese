import { MainScene } from "./classPackage/PhaserScene/MainScene";
import io from "socket.io-client";
import { startListenerSocket } from "./Network/ListenerSocket";


const btnJoin = document.getElementById("btn-join") as HTMLButtonElement;
const btnHost = document.getElementById("btn-host") as HTMLButtonElement;
const roomCodeDiv = document.querySelector(".room-code") as HTMLDivElement;
const btnProfile = document.getElementById("profile") as HTMLButtonElement;
const modal = document.querySelector(".modal") as HTMLDivElement;
const btnRegister = document.getElementById('btn-register') as HTMLButtonElement;
const btnLogin = document.getElementById('btn-login') as HTMLButtonElement;
const inpMail = document.getElementById('mail') as HTMLInputElement;
const inpUsername = document.getElementById('pseudo') as HTMLInputElement;
const inpPassword = document.getElementById('password') as HTMLInputElement;
const inpRoom = document.getElementById('room-code') as HTMLInputElement;
const user = document.getElementById('username') as HTMLParagraphElement;
const modalHost = document.getElementById("modalHost") as HTMLDivElement;
const btnStartGame = document.getElementById("StartGame") as HTMLButtonElement;
const loadingModal = document.getElementById("loadingModal") as HTMLDivElement;

btnJoin.addEventListener("click", () => {toggleModal(roomCodeDiv)});
//var idUserConnected:number;

export var socket:SocketIOClient.Socket;
export var roomOfUser:string;
export var hasSocket:boolean = false;
export var hasRoom:boolean = false;
const URI = "http://localhost:3000";


btnProfile.addEventListener("click", () => {toggleModal(modal)});
document.addEventListener("click", e => {
  if (
    !btnJoin.contains(e.target as Node) &&
    !btnProfile.contains(e.target as Node) &&
    !roomCodeDiv.contains(e.target as Node) &&
    !modal.contains(e.target as Node)
  ) {
    e.stopPropagation();
    toggleModal(roomCodeDiv, false);
    toggleModal(modal, false);
  }
});

function toggleModal(obj: HTMLElement, value?: boolean): boolean {
  obj.classList.toggle('active', value);
  return obj.classList.contains('active');
}
function toggleDisplay(obj: HTMLElement, value?: boolean): boolean {
  obj.classList.toggle('hidden', value);
  return obj.classList.contains('hidden');
}

async function postRegister(): Promise<Response> {
  const res: Response = await fetch(`/register`, {
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
    await postLogin();
  }
  else alert(`An error occured during your registration..`);
  return res;
}

btnRegister.addEventListener("click", postRegister);

async function postLogin(): Promise<Response> {
  const res: Response = await fetch(`/login`, {
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
      user.textContent = data.username;
      socket = io(URI);
      socket.emit("loginOk",{idUser: data.id})
      console.log("socket établie");
      hasSocket = true;
      console.log("Connected: ",hasSocket,"\nOn: ",socket); ////
      toggleModal(modal, false);
      btnHost.disabled = false;
      btnJoin.disabled = false;

  } catch (error) {
    console.error(error);
  }
   
    
  } else user.textContent = '';
  if (hasSocket){
    startListenerSocket();
  }
  return res;
}

btnLogin.addEventListener("click", postLogin);


window.addEventListener("DOMContentLoaded",start);

function start(){
  console.log("start lancé");
  btnHost.disabled = true;
  btnJoin.disabled = true;

    btnHost.addEventListener("click", async () => {
      toggleDisplay(modalHost);
      socket.emit("hostRoom", (roomInfo:string[]) => {
        roomDisplay(roomInfo);
        hasRoom = true;
      });
    });
    
    btnJoin.addEventListener("click", () => {
      toggleModal(roomCodeDiv);
    });
    
    
    
    
    let btnJoinRoomValid:HTMLElement = document.getElementById("btn-joinRoomValid")!;
    
    btnJoinRoomValid.addEventListener("click", () => {
      let valueRoomCode:string = (document.getElementById("room-code") as HTMLInputElement)!.value ;
      toggleDisplay(modalHost);

      socket.emit("joinRoom", { roomId: valueRoomCode }, (response:string[]) => {
          console.log("l'information recu en callback est: ",response);
          hasRoom = true;
          roomDisplay(response);
        })
      });

      
  
}

function toggleDisable(obj: HTMLButtonElement|HTMLFieldSetElement|HTMLInputElement|HTMLOptGroupElement|HTMLOptionElement|HTMLSelectElement|HTMLTextAreaElement, value?: boolean): boolean {
  obj.disabled = value?value:!obj.disabled;
  return obj.disabled;
}







export function roomDisplay(dataOfRoom:string[]):void{
  let idGameHTML:HTMLElement = document.getElementById("idGame")!;
  try {
  idGameHTML.innerHTML = dataOfRoom[0];
  let player1:HTMLElement = document.getElementById("Player1")!;
  let player2:HTMLElement = document.getElementById("Player2")!;
  player1.innerHTML = `Joueur 1: ${dataOfRoom[1]}`;
  player2.innerHTML = `Joueur 2: ${dataOfRoom[2]}`;
  let player3:HTMLElement = document.getElementById("Player3")!;
  player3.innerHTML = `Joueur 3: ${dataOfRoom[3]}`;
  } catch (error) {
    console.error(error);
  }
// Les données sont toujours [0] = roomId [1] = joueur 1 roomId[2] = joueur 2 .. etc 

}




// pinia singleton
// vuex

// Modal Host
export var mainScene:MainScene = new MainScene();

btnStartGame.addEventListener("click", () => {
  const loadingModal = document.getElementById("loadingModal");
  const mainMenu = document.getElementById("mainMenu");
  if (loadingModal) loadingModal.classList.remove("hidden");

  startGame();
});

function startGame(){

    const config:Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game',
      };
    
    
      var __game:Phaser.Game = new Phaser.Game(config);
      __game.scene.add('mainScene', mainScene, true);





}