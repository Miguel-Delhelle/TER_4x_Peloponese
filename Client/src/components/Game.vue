<script setup lang="ts">
import Phaser from 'phaser';
import {onMounted} from "vue";
import mainTile from '../assets/tiled/Tileset/Ground.png'
import mapJson from '../assets/tiled/Greece.json'

class MainGame extends Phaser.Scene{

    map:Phaser.Tilemaps.Tilemap;

    constructor(){
        super('GreatGame');
    }

    preload () {
      this.load.image('tiles', mainTile);
      this.load.tilemapTiledJSON('map', mapJson);
    }
    
    create () {        
        this.map = this.make.tilemap({ key: 'map' });
        const tiles = this.map.addTilesetImage('Ground', 'tiles');
        const layer0 = this.map.createLayer('Plains', tiles, 0, 0);
        const layer1 = this.map.createLayer('Cliff', tiles, 0, 0);
    }
    
    update () {}
    
    
}

const config:Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: MainGame,
    //parent: 'game-container',
  };

  var __game:Phaser.Game = new Phaser.Game(config);

onMounted(() => {

});

</script>