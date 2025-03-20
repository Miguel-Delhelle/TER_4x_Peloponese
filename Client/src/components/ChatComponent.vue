<template>
    <div class="chat">
      <ul>
        <li v-for="(msg, index) in messages" :key="index">
          <strong>{{ msg.clientId }}:</strong> {{ msg.message }}
        </li>
      </ul>
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Tapez votre message..."
      />
      <button @click="sendMessage">Envoyer</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { io, Socket } from 'socket.io-client';
  
  interface ChatMessage {
    clientId: string;
    message: string;
  }
  
  // Connexion au serveur backend (ajustez l'URL si besoin)
  const socket: Socket = io("http://localhost:"+window.location.port);
  
  const messages = ref<ChatMessage[]>([]);
  const newMessage = ref<string>('');
  
  const sendMessage = (): void => {
    if (newMessage.value.trim()) {
      socket.emit('message', newMessage.value);
      newMessage.value = '';
    }
  };
  
  // Réception des messages
  const handleMessage = (data: ChatMessage): void => {
    messages.value.push(data);
  };
  
  onMounted(() => {
    socket.on('message', handleMessage);
  });
  
  onUnmounted(() => {
    socket.off('message', handleMessage);
  });
  </script>
  
  
  <style scoped>
  .chat {
    max-width: 600px;
    margin: auto;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  input {
    width: calc(100% - 80px);
    padding: 8px;
  }
  button {
    width: 60px;
    padding: 8px;
  }
  </style>
  