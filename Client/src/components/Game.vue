<script setup lang="ts">
import Phaser from 'phaser';
import {onMounted} from "vue";
import { MainScene } from '../classPackage/phaserScene/MainScene';
import { mainScene } from '../main';

const config:Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 120*16,
    height: 60*16,
    parent: 'app',
  };


onMounted(() => {
  var __game:Phaser.Game = new Phaser.Game(config);
  __game.scene.add('mainScene', mainScene, true);
});
</script>