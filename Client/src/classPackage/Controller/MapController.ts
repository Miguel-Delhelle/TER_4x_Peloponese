import { MainScene } from "../PhaserScene/MainScene";
import Phaser from "phaser";


export class MapController {
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private scene:MainScene;
	private camera:Phaser.Cameras.Scene2D.Camera;
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
	private isMousewheelDown: boolean = false;
	private zoomInMax: number;
	private zoomOutMax: number;
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
	private isDragging: boolean = false;
	private dragStartX: number = 0;
	private dragStartY: number = 0;


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	constructor(scene:MainScene) {
		this.scene = scene;
		this.setupCamera();
	}


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ACCESSORS  DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/

	public get _scene(): MainScene {return this.scene;}

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _camera(): Phaser.Cameras.Scene2D.Camera {return this.camera;}

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _isDragging(){
		return this.isDragging;
	}

	
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                             METHODS  DEFINITION                                             |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private setupCamera(): void {
		this.camera = this.scene.cameras.main;
    this.camera.roundPixels = true;
		this.camera.setBounds(0,0,this.scene._mapSizeXpx,this.scene._mapSizeYpx);
		console.log(this.camera.getBounds());
		this.zoomOutMax = Math.max(
			this.camera.width / this.scene._mapSizeXpx,
			this.camera.height / this.scene._mapSizeYpx
		)*2;
		this.zoomInMax = 2;
	}
	

	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                             EVENTS  DEFINITION                                              |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	panningStart = (pointer: Phaser.Input.Pointer): void => {
		if (pointer.middleButtonDown()) {
			this.isMousewheelDown = true;
			this.dragStartX = pointer.x;
			this.dragStartY = pointer.y;
		}
	}

	panningStop = (pointer: Phaser.Input.Pointer): void => {
		if (!pointer.middleButtonDown()) {
			this.isMousewheelDown = false;
		}
	}

	panningMove = (pointer: Phaser.Input.Pointer): void => {
		if (this.isMousewheelDown) {
			const deltaX = pointer.x - this.dragStartX;
			const deltaY = pointer.y - this.dragStartY;
			this.camera.scrollX -= deltaX / this.camera.zoom;
			this.camera.scrollY -= deltaY / this.camera.zoom;
			this.dragStartX = pointer.x;
			this.dragStartY = pointer.y;
		}
	}


	zoom = (
    pointer: Phaser.Input.Pointer,
    gameObjects: Phaser.GameObjects.GameObject[],
    deltaX: number,
    deltaY: number,
    deltaZ: number
	): void => {
		if (!this.isMousewheelDown) {
			const worldPointBefore = this.camera.getWorldPoint(pointer.x, pointer.y);
			let zoomFactor = 1.13;
      const zoomPrevious: number = this.camera.zoom;
			this.camera.zoom = deltaY > 0
				? Math.max(this.zoomOutMax, this.camera.zoom / zoomFactor) // Zoom OUT
				: Math.min(this.zoomInMax, this.camera.zoom * zoomFactor); // Zoom IN
      const zoomNext: number = this.camera.zoom;
      const isChanged: boolean = 
        (Math.min(zoomPrevious,zoomNext) < (this.zoomOutMax+this.zoomInMax)/2) && 
        (Math.max(zoomPrevious,zoomNext) >= (this.zoomOutMax+this.zoomInMax)/2);
      if (isChanged) {
        this._scene.toggleMapgrid(zoomNext>zoomPrevious);
      }
			this.camera.preRender();

			const worldPointAfter = this.camera.getWorldPoint(pointer.x, pointer.y);
			this.camera.scrollX -= worldPointAfter.x - worldPointBefore.x;
			this.camera.scrollY -= worldPointAfter.y - worldPointBefore.y; 
		}
	};

}