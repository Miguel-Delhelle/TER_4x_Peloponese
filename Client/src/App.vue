<script setup lang="ts">
import Game from "./components/Game.vue";
import ChatComponent from "./components/ChatComponent.vue"
import ToolsBar from "./components/ToolsBar.vue";

</script>

<template>
  <Game id="game">  
  </Game>
  <ToolsBar id="toolsBar" class="ui"/>
</template>

<style scoped>

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
