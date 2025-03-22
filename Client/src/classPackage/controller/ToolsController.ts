import type { MainScene } from "../phaserScene/MainScene";

export class ToolsController{
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private inBuilding: boolean = false;
	private currentBuildingID: number = 4594;
	private toolbarHTML: HTMLElement = document.getElementById("toolsBar");
	private itemHTML: Map<string,Element> = new Map<string,Element>();
	private mainScene: MainScene;


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	public constructor(mainScene:MainScene){
		this.mainScene = mainScene;
		this.initItemHTML(this.toolbarHTML);
		this.setupEvent();
	}


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ACCESSORS  DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	public get _inBuilding(): boolean {return this.inBuilding;}


	public setInBuilding(newValue: boolean) {
		this.inBuilding = newValue;
		if (newValue) {
			this.toolbarHTML.classList.add("isActive");
			console.log("Building mode: on");
			this._mainScene.changeMarker(this.currentBuildingID-1);
      	this.openSubToolB();
		} else {
			this.toolbarHTML.classList.remove("isActive");
			console.log("Building mode: off");
			this._mainScene.changeMarker();
      	this.openSubToolB();
		}
	}

	public toggleInBuilding(): boolean {
		this.setInBuilding(!this.inBuilding);
		return this.inBuilding;
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _currentBuildingID(): number {return this.currentBuildingID;}
	
	public set _currentBuildingID(newValue: number) {this.currentBuildingID = newValue;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _toolbarHTML(): HTMLElement {return this.toolbarHTML;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _itemHTML(): Map<string,Element> {return this.itemHTML;}


	private initItemHTML(toolbar:HTMLElement): void {
		for (let i=0; i<toolbar.children.length; i++){
			this.itemHTML.set((toolbar.children.item(i).id),((toolbar.children.item(i))));
		}
		console.log(this.itemHTML);
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _mainScene(): MainScene {return this.mainScene;}


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                             METHODS  DEFINITION                                             |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/

	private setupEvent(): void {
		this.itemHTML.get("build").addEventListener("click", () => {this.toggleInBuilding();});
	}

	build = () => {
		if (this.inBuilding){
			this.mainScene._map.putTileAt(this.currentBuildingID,this.mainScene._pointer.x,this.mainScene._pointer.y);
			console.log("A tile has been added!")
		}
		//mainscene.map.putTileAt()
	}

  openSubToolB(){
    let subTool = document.getElementById("subToolBuild");
    if (subTool.style.visibility =="visible"){
        subTool.style.visibility="hidden";
    }else{
      subTool.style.visibility="visible";
    }
  }

}