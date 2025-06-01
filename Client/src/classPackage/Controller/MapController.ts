import { Point } from "../Math/Point";
import { MainScene } from "../PhaserScene/MainScene";
import Phaser from "phaser";

type GridConfig = {
  dimensionFactor?: number,
  lineWidth?: number,
  lineColor?: number,
  lineAlpha?: number,
  fillColor?: number,
  fillAlpha?: number,
};

type PhaserControls = Phaser.Cameras.Controls.FixedKeyControl|Phaser.Cameras.Controls.SmoothedKeyControl;

export class MapController {
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private _scene: MainScene;
	private _camera!: Phaser.Cameras.Scene2D.Camera;
  private _controls!: PhaserControls;
  private _gridLines: Phaser.GameObjects.Graphics|null = null;
  private static gridConfig: GridConfig = {
    dimensionFactor: 1,
    lineWidth: 1,
    lineColor: Phaser.Display.Color.GetColor(23,23,23),
    lineAlpha: 0.2,
  };
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
	private _isMousewheelDown: boolean = false;
	private _zoomInMax: number = 2;
	private _zoomOutMax: number = 0.5;
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
  private _dragStart: Point = new Point();


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	constructor(scene:MainScene) {
		this._scene = scene;
		this.setupCamera();
    this.setupControls();
	}


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ACCESSORS  DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/

	public get scene(): MainScene {return this._scene;}

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get camera(): Phaser.Cameras.Scene2D.Camera {return this._camera;}

  public set camera(obj: Phaser.Cameras.Scene2D.Camera) {this._camera = obj;}

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get controls(): PhaserControls {return this._controls;}

  public set controls(obj: PhaserControls) {this._controls = obj;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get gridLines(): Phaser.GameObjects.Graphics|null {return this._gridLines;}

  public set gridLines(grid: Phaser.GameObjects.Graphics|null) {
    if(this._gridLines instanceof Phaser.GameObjects.Graphics) this._gridLines.destroy();
    this._gridLines = grid;
  }

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get isMousewheelDown(): boolean {return this._isMousewheelDown;}

  private set isMousewheelDown(val: boolean) {this._isMousewheelDown = val;}

  private toggleIsMousewheelDown(val?: boolean): boolean {
    return this.isMousewheelDown = val ?? !this.isMousewheelDown;
  }

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get zoomInMax(): number {return this._zoomInMax;}

  private set zoomInMax(val: number) {this._zoomInMax = val;}

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get zoomOutMax(): number {return this._zoomOutMax;}

  private set zoomOutMax(val: number) {this._zoomOutMax = val;}

	
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get dragStart(): Point {return this._dragStart;}

  private set dragStart(val: Point) {this._dragStart = val;}

	
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                             METHODS  DEFINITION                                             |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private setupCamera(): void {
		this.camera = this.scene.cameras.main;
		this.camera.setBounds(0,0,this.scene._mapSizeXpx,this.scene._mapSizeYpx);
		console.log(this.camera.getBounds());
		this._zoomOutMax = Math.max(
			this.camera.width / (this.scene._mapSizeXpx * 0.5),
			this.camera.height / (this.scene._mapSizeYpx * 0.5)
		);
		this._zoomInMax = 2;
    this.gridLines = this.drawMapGridLines({});
	}

  private setupControls() {
    const cursors = this.scene.input.keyboard!.createCursorKeys();
    const controlConfig = {
      camera: this.camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 1.0,
      zoomIn: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT),
      zoomOut: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD),
      zoomSpeed: 0.015
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }
  
  
  //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

  public drawMapGridLines(config: GridConfig): Phaser.GameObjects.Graphics {
    config.dimensionFactor = config.dimensionFactor?
      Math.round(config.dimensionFactor):
      MapController.gridConfig.dimensionFactor!;
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(
      config.lineWidth ?? MapController.gridConfig.lineWidth!,
      config.lineColor ?? MapController.gridConfig.lineColor!,
      config.lineAlpha ?? MapController.gridConfig.lineAlpha!
    );
    const tileWidth = this.scene._map.tileWidth * config.dimensionFactor;
    const tileHeight = this.scene._map.tileHeight * config.dimensionFactor;
    const mapWidth = this.scene._map.width / config.dimensionFactor;
    const mapHeight = this.scene._map.height / config.dimensionFactor;
    // Draw vertical grid lines
    for (let x = 0; x <= mapWidth; x++) {
      graphics.moveTo(x * tileWidth, 0);
      graphics.lineTo(x * tileWidth, mapHeight * tileHeight);
    }
    // Draw horizontal grid lines
    for (let y = 0; y <= mapHeight; y++) {
      graphics.moveTo(0, y * tileHeight);
      graphics.lineTo(mapWidth * tileWidth, y * tileHeight);
    }
    graphics.strokePath();
    if (config.fillColor) {
      graphics.fillStyle(config.fillColor, config.fillAlpha);
      graphics.fillPath();
    }
    return graphics;
  }
	

	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                             EVENTS  DEFINITION                                              |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	panningStart = (pointer: Phaser.Input.Pointer): void => {
		if (pointer.middleButtonDown()) {
			this.isMousewheelDown = true;
			this.dragStart.x = pointer.x;
			this.dragStart.y = pointer.y;
		}
	}

	panningStop = (pointer: Phaser.Input.Pointer): void => {
		if (!pointer.middleButtonDown()) {
			this.isMousewheelDown = false;
		}
	}

	panningMove = (pointer: Phaser.Input.Pointer): void => {
		if (this.isMousewheelDown) {
			const deltaX = pointer.x - this.dragStart.x;
			const deltaY = pointer.y - this.dragStart.y;
			this.camera.scrollX -= deltaX / this.camera.zoom;
			this.camera.scrollY -= deltaY / this.camera.zoom;
			this.dragStart.x = pointer.x;
			this.dragStart.y = pointer.y;
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
      const initCoeff: number = 100*(1-(this.camera.zoom-this.zoomOutMax)/(this.zoomInMax-this.zoomOutMax));
			this.camera.zoom = deltaY > 0
				? Math.max(this.zoomOutMax, this.camera.zoom / zoomFactor) // Zoom OUT
				: Math.min(this.zoomInMax, this.camera.zoom * zoomFactor); // Zoom IN
			this.camera.preRender();

      const afterCoeff: number = 100*(1-(this.camera.zoom-this.zoomOutMax)/(this.zoomInMax-this.zoomOutMax));
      if (initCoeff<70 && afterCoeff>=70) 
        this.gridLines = null;
      else if (initCoeff>70 && afterCoeff<=70)
        this.gridLines = this.drawMapGridLines({});

			const worldPointAfter = this.camera.getWorldPoint(pointer.x, pointer.y);
			this.camera.scrollX -= worldPointAfter.x - worldPointBefore.x;
			this.camera.scrollY -= worldPointAfter.y - worldPointBefore.y; 
		}
	};

}