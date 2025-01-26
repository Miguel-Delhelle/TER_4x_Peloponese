import { User } from './User';

window.addEventListener("load",main);


function main(){
    console.log("Coucou toi");
    let clientTest = new User();
    clientTest.listenForMessages();
    clientTest.sendMessage("Bien connectée");
}

