import { MainScene } from "./classPackage/PhaserScene/MainScene";
import io from "socket.io-client";

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
//var idUserConnected:number;
var socket:SocketIOClient.Socket;


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
  const res: Response = await fetch('/register', {
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
  if (res.ok) alert(`Welcome on board ${inpUsername.value} !`);
  else alert(`An error occured during your registration..`);
  return res;
}

btnRegister.addEventListener("click", postRegister);

async function postLogin(): Promise<Response> {
  const res: Response = await fetch('/login', {
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
    const data = await res.json();
    user.textContent = data.username;
    socket = io("http://localhost:3000");
    socket.emit("loginOk",{
      idUser: data.id
    })
    console.log(socket.id);
  } else user.textContent = '';
  return res;
}

btnLogin.addEventListener("click", postLogin);


btnHost.addEventListener("click", async () => {
  toggleDisplay(modalHost);
  socket.emit("hostRoom");
  socket.on("roomId", (idGame:string) => {
    let idGameHTML:HTMLElement = document.getElementById("idGame")!;
    idGameHTML.innerHTML = idGame;

    
  });
});

btnJoin.addEventListener("click", () => {
  toggleModal(roomCodeDiv);
});

let btnJoinRoomValid:HTMLElement = document.getElementById("btn-joinRoomValid")!;
let valueRoomCode:HTMLInputElement = document.getElementById("room-code") as HTMLInputElement;
btnJoinRoomValid.addEventListener("click", async (valueRoomCode) => {
  socket.emit("joinRoom",valueRoomCode);
})



export var mainScene:MainScene = new MainScene();

// pinia singleton
// vuex

// Modal Host




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