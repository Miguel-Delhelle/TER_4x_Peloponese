<script setup lang="ts">
import Phaser from 'phaser';
import {onMounted} from "vue";
import skyImage from '@/assets/sky.png';
import groundImage from '@/assets/platform.png';
import starImage from '@/assets/star.png';
import bombImage from '@/assets/bomb.png';
import dudeSprite from '@/assets/dude.png';
import jsonMap from '@/assets/tiled/maps/Greece.json'
import ground from '@/assets/tiled/tilesets/Ground.png'

class MainGame extends Phaser.Scene{

    constructor(){
        super('GreatGame');
    }

    preload () {
      this.load.image('tiles', ground);
      this.load.tilemapTiledJSON('map', jsonMap);
      /*
        this.load.image('sky', skyImage);
        this.load.image('ground', groundImage);
        this.load.image('star', starImage);
        this.load.image('bomb', bombImage);
        this.load.spritesheet('dude', 
            dudeSprite,
            { frameWidth: 32, frameHeight: 48 }
        );*/
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
    // @ts-ignore
    var _game:Phaser.Game = new Phaser.Game(config);
});

</script>