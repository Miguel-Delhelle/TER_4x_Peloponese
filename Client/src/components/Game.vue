<script setup lang="ts">
import Phaser from 'phaser';
import {onMounted} from "vue";
import mainTile from '../assets/tiled/Tileset/Ground.png';
import mapJson from '../assets/tiled/Greece.json';
import treeTile from '../assets/tiled/Tileset/MiniWorldSprites/Nature/Trees.png'
import allAssetsTile from '../assets/tiled/Tileset/MiniWorldSprites/AllAssetsPreview.png'
import { MapController } from '../classPackage/controller/MapController';
import { MainScene } from '../classPackage/phaserScene/MainScene';

var mainScene:MainScene = new MainScene();

const config:Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 120*16,
    height: 60*16,
    //parent: 'game-container',
  };


onMounted(() => {
  var __game:Phaser.Game = new Phaser.Game(config);
  __game.scene.add('mainScene', mainScene, true);
});

</script>