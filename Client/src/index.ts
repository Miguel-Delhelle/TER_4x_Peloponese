export {};

const btnJoin = document.getElementById("btn-join") as HTMLButtonElement;
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

btnJoin.addEventListener("click", () => {toggleModal(roomCodeDiv)});
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
  } else user.textContent = '';
  return res;
}

btnLogin.addEventListener("click", postLogin);