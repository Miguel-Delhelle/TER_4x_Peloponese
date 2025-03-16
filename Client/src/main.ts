import { createApp} from 'vue'
import './style.css'
import App from './App.vue'
import { ToolsController } from './classPackage/controller/ToolsController'
import { MainScene } from './classPackage/phaserScene/MainScene'

//Toutes les variables globales 

export var mainScene:MainScene = new MainScene();


createApp(App).mount('#app')

window.addEventListener("load",start);

function start(){
    //var toolsController = new ToolsController();

}

/**/
