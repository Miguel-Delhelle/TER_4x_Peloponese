import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { User } from './User';
import * as d3 from 'd3';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


window.addEventListener("load",main);


function main(){
    console.log("Coucou toi");
    let clientTest = new User();
    
    clientTest.listenForMessages();
    clientTest.sendMessage("Bien connectée");
}

