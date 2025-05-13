const btnJoin = document.getElementById("btn-join") as HTMLButtonElement;
const roomCodeDiv = document.querySelector(".room-code") as HTMLDivElement;
const profileBtn = document.getElementById("profile") as HTMLButtonElement;
const modal = document.querySelector(".modal") as HTMLDivElement;

btnJoin.addEventListener("click", () => {
  const isVisible = roomCodeDiv.classList.contains("visible");
  roomCodeDiv.classList.toggle("visible", !isVisible);
  roomCodeDiv.classList.toggle("hidden", isVisible);
});

profileBtn.addEventListener("click", () => {
  const isHidden = modal.classList.contains("hidden");
  modal.classList.toggle("hidden", !isHidden);
});