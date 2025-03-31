import type { MainScene } from "../PhaserScene/MainScene";

export class ToolsController{
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private inBuilding: boolean = false;
	private currentBuildingID: number = 120;
	private inRecruitment: boolean = false;
	private currentUnitId: number = 2;
	private toolbarHTML: HTMLElement = document.getElementById("toolsBar");
	private subToolHTML: HTMLElement = document.getElementById("subTool");
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

	public setInRecruitment(newValue: boolean) {
		this.inRecruitment = newValue;
		if (newValue) {
			this.toolbarHTML.classList.add("isActive");
			console.log("Recruit mode: on");
			this._mainScene.changeMarker(this.currentUnitId);
      	this.openSubToolB();
		} else {
			this.toolbarHTML.classList.remove("isActive");
			console.log("Recruit mode: off");
			this._mainScene.changeMarker();
      	this.openSubToolB();
		}
	}

	public toggleInRecruitment(): boolean {
		this.setInRecruitment(!this.inRecruitment);
		return this.inRecruitment;
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
		this.itemHTML.get("recruit").addEventListener("click", () => {this.toggleInRecruitment();})
	}

	recruit = () => {

		if (this.inRecruitment){
			console.log("recrutement lancé pour de vrai");
			this.mainScene.add.sprite(this.mainScene._pointer.x,this.mainScene._pointer.y,this.mainScene._spritesets[1],this.currentUnitId);
			console.log("L'unité à a été ajouté!");
			console.log(this.mainScene._spritesets)
		}else {		
		console.log("recruit lancé et bloqué");
		}
		//mainscene.map.putTileAt()
	}

	build = () => {
		if (this.inBuilding){
			this.mainScene._map.putTileAt(this.currentBuildingID,this.mainScene._pointer.x,this.mainScene._pointer.y);
			console.log("A tile has been added!") //this.currentBuildingID,
		}
		//mainscene.map.putTileAt()
	}

  openSubToolB(){
    let subTool = document.getElementById("subTool");
    if (subTool.style.visibility =="visible"){
        subTool.style.visibility="hidden";
    }else{
      subTool.style.visibility="visible";
    }
  }

}