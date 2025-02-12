import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { User } from './User';
import * as d3 from 'd3';
import { listTiles } from './Map/Map_GenerativeFunctions';
import * as map from './Map/Map_GenerativeFunctions';
import { Unit } from './Entity/Unity/Unit';
import { Tiles } from './Map/Tiles';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


window.addEventListener("load",main);


function main(){
    console.log("Coucou toi");
    let clientTest = new User();

    
    const svg = d3.select("body")
      .append("svg")
      .attr("width",3000)
      .attr("height",3000);
    
    //map.helloWorld();
    map.polygonMap(svg,[0,0],25,6,50,20);
    
    
    clientTest.listenForMessages();
    clientTest.sendMessage("Bien connectée");

    let uniteTest:Unit = new Unit();

    for (let obj of listTiles){
      console.log(obj);
    }

}

