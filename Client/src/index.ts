export {};

const btnJoin = document.getElementById("btn-join") as HTMLButtonElement;
const roomCodeDiv = document.querySelector(".room-code") as HTMLDivElement;
const btnProfile = document.getElementById("profile") as HTMLButtonElement;
const modal = document.querySelector(".modal") as HTMLDivElement;
const btnRegister = document.getElementById('btn-register') as HTMLButtonElement;

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
  const mail: string = (document.getElementById('mail') as HTMLInputElement).value;
  const user: string = (document.getElementById('pseudo') as HTMLInputElement).value;
  const pass: string = (document.getElementById('password') as HTMLInputElement).value;

  const res: Response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mail: mail,
      username: user,
      password: pass
    })
  });
  if (res.ok) alert(`Welcome on board ${user} !`);
  else alert(`An error occured during your registration..`);
  return res;
}

btnRegister.addEventListener("click", postRegister);

(async () => {console.log(await fetch('/coucou'));})();