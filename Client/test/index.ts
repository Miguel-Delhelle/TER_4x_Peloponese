export {};

const btnJoin = document.getElementById("btn-join") as HTMLButtonElement;
const roomCodeDiv = document.querySelector(".room-code") as HTMLDivElement;
const profileBtn = document.getElementById("profile") as HTMLButtonElement;
const modal = document.querySelector(".modal") as HTMLDivElement;
const btnRegister = document.getElementById('btn-register') as HTMLButtonElement;

btnJoin.addEventListener("click", () => {
  const isVisible = roomCodeDiv.classList.contains("visible");
  roomCodeDiv.classList.toggle("visible", !isVisible);
  roomCodeDiv.classList.toggle("hidden", isVisible);
});

profileBtn.addEventListener("click", () => {
  const isHidden = modal.classList.contains("hidden");
  modal.classList.toggle("hidden", !isHidden);
});

async function postRegister(): Promise<Response> {
  const mail: string = (document.getElementById('mail') as HTMLInputElement).value;
  const user: string = (document.getElementById('username') as HTMLInputElement).value;
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
  return res;
}

btnRegister.addEventListener("click", postRegister);

console.log(await fetch('/coucou'));