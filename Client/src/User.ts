import io from "socket.io-client";

export class User{
    private socket;

    constructor(){
        this.socket = io()
    }

    listenForMessages() {
        this.socket.on('message', (data: string) => {
            const messageDiv = document.getElementById('messages');
            if (messageDiv) {
                messageDiv.innerHTML += `<p>${data}</p>`;
            }
        });
    }
    
    
    sendMessage(message: string) {
        this.socket.emit('clientMessage', message);
    }
}

