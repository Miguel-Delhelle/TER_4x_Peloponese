<script setup lang="ts">
import {onMounted} from "vue";
import skyImage from '@/assets/sky.png';
import groundImage from '@/assets/platform.png';
import starImage from '@/assets/star.png';
import bombImage from '@/assets/bomb.png';
import dudeSprite from '@/assets/dude.png';

    function preload () {
        this.load.image('sky', skyImage);
        this.load.image('ground', groundImage);
        this.load.image('star', starImage);
        this.load.image('bomb', bombImage);
        this.load.spritesheet('dude', 
            dudeSprite,
            { frameWidth: 32, frameHeight: 48 }
        );}
    
    function create () {        
        this.add.image(400, 300, 'sky');
    }
    
    function update () {}
    
    
    

const config:Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,create,update
    },
    //parent: 'game-container',
  };

onMounted(() => {
    var game = new Phaser.Game(config);
});

</script>