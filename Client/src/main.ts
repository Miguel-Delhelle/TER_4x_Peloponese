import { createApp} from 'vue'
import './style.css'
import { ToolsController } from './classPackage/Controller/ToolsController'
import { MainScene } from './classPackage/PhaserScene/MainScene'
import { Unit } from './classPackage/Entity/units/Unit'
import { SpriteLoaded } from './classPackage/PhaserScene/AssetManager/SpriteLoaded'
import { AssetsEnum } from './classPackage/PhaserScene/AssetManager/AssetsEnum'

//Toutes les variables globales 

export var mainScene:MainScene = new MainScene();

// pinia singleton
// vuex


window.addEventListener("load",start);

function start(){
    //var toolsController = new ToolsController();
    //mainScene.add.sprite(mainScene._pointer.x,mainScene._pointer.y,mainScene._spritesets[0],3467);


}



/**/
