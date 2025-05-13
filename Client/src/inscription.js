document.getElementById("switch-to-register").addEventListener("click", (event)=>{
    event.preventDefault();
    document.querySelector(".wrapper").classList.add("hidden");
})

document.getElementById("switch-to-login").addEventListener("click", (event)=>{
    event.preventDefault();
    document.querySelector(".wrapper").classList.remove("hidden");
})