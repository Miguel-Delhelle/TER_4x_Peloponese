import './style.css'
//import { ToolsController } from './classPackage/Controller/ToolsController'
import { MainScene } from './classPackage/PhaserScene/MainScene'
//import { SpriteLoaded } from './classPackage/PhaserScene/AssetManager/SpriteLoaded'
//import { AssetsEnum } from './classPackage/PhaserScene/AssetManager/AssetsEnum'
import Phaser from 'phaser'

//Toutes les variables globales 

export var mainScene:MainScene = new MainScene();

// pinia singleton
// vuex


window.addEventListener("load",start);

function start(){

    const config:Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game',
      };
    
    
      var __game:Phaser.Game = new Phaser.Game(config);
      __game.scene.add('mainScene', mainScene, true);




}

await hello();


async function hello() {
  console.log("hello")
}



/**/
