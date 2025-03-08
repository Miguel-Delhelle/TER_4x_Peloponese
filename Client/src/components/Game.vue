<script setup lang="ts">
import Phaser from 'phaser';
import {onMounted} from "vue";
import jsonMap from '../../public/assets/tiled/maps/Greece.json';
import ground from '../../public/assets/tiled/tilesets/Ground.png';

class MainGame extends Phaser.Scene{

    map:Phaser.Tilemaps.Tilemap;

    constructor(){
        super('GreatGame');
    }

    preload () {
      this.load.image('tiles', "../../public/assets/tiled/tilesets/Ground.png");
      this.load.tilemapTiledJSON('map', '../../public/assets/tiled/maps/Greece.json');
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

onMounted(() => {

    var __game:Phaser.Game = new Phaser.Game(config);
});

</script>