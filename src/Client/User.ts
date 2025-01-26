import io from "socket.io-client";

export class User{
    private proxy;

    constructor(){
        this.proxy = io()
    }

    listenForMessages() {
        this.proxy.on('message', (data: string) => {
            const messageDiv = document.getElementById('messages');
            if (messageDiv) {
                messageDiv.innerHTML += `<p>${data}</p>`;
            }
        });
    }
    
    
    sendMessage(message: string) {
        this.proxy.emit('clientMessage', message);
    }
}

