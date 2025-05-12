const isConnected = true;
const userName = "Alexandre";

window.addEventListener("DOMContentLoaded", () => {
  const logoutIcon = document.getElementById("logout-icon");
  const username = document.getElementById("username");

  logoutIcon.style.display = isConnected ? "inline-block" : "none";
  username.textContent = isConnected ? userName : "";
});
