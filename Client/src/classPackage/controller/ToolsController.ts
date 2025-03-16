import type { MainScene } from "../phaserScene/MainScene";


export class ToolsController{

    inBuilding:boolean=false;
    toolBarHtml:HTMLElement
    itemHtml:Map<string,Element> = new Map<string,Element>();
    mainScene:MainScene;

    constructor(mainScene:MainScene){
        this.mainScene = mainScene;
        let toolBar = document.getElementById("toolsBar");
        this.toolBarHtml = toolBar;
        this.initItemHtml(toolBar);
        this.setupEvent();
    }

    initItemHtml(toolBar:HTMLElement){
        for (let i=0; i<toolBar.children.length; i++){
            this.itemHtml.set((toolBar.children.item(i).id),((toolBar.children.item(i))));
        }
        console.log(this.itemHtml);
    }
    setupEvent(){
        this.itemHtml.get("build").addEventListener("click", () => {
            if (this.inBuilding){
                this.inBuilding=false;
                this.toolBarHtml.classList.remove("on");
                console.log("Pas en building")
            }
            else{
                this.inBuilding=true;
                this.toolBarHtml.classList.add("on");
                console.log("On building")
            };
        });
    }
    build = () => {
        if (this.inBuilding){
        this.mainScene._map.putTileAt(4,this.mainScene._pointer.x,this.mainScene._pointer.y);
        console.log("methode build lancé")
        }
        //mainscene.map.putTileAt()
    }
    


}