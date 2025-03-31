<script setup lang="ts">
import Phaser from 'phaser';
import {onMounted} from "vue";
import { MainScene } from '../classPackage/PhaserScene/MainScene';
import { mainScene } from '../main';

const config:Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'app',
  };


onMounted(() => {
  var __game:Phaser.Game = new Phaser.Game(config);
  __game.scene.add('mainScene', mainScene, true);
});
</script>