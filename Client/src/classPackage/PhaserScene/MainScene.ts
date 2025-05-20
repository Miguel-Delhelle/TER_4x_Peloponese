//import mapPng from '../../../res/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png';
//import mapJson from '/mapTiled/Maps/Test.json';
//import mapPng from '/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png'
import { MapController } from '../Controller/MapController';
import { ToolsController } from '../Controller/ToolsController';
import Phaser from 'phaser';
import Easystar from 'easystarjs';
import { GreekMap } from './Map/GreekMap';
import { addSpriteAndAnimate } from '../Entity/AnimationManager';
import { Point } from '../Math/Point';



export class MainScene extends Phaser.Scene{
	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ATTRIBUTES DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private ourMap!:GreekMap;
	private map!: Phaser.Tilemaps.Tilemap;
	private mapController!: MapController;
	private toolsController!: ToolsController;
	private marker!: Phaser.GameObjects.Sprite;
	 private static markerDefaultID: number | string = 91;
	private layers: Phaser.Tilemaps.TilemapLayer[] = [];
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
	private mapSizeXpx!: number;
	private mapSizeYpx!: number;
	private tilesets: Map<string,Phaser.Tilemaps.Tileset> = new Map<string,Phaser.Tilemaps.Tileset>();
	private spritesets: string[] = [];

	private controls!:Phaser.Cameras.Controls.FixedKeyControl;
	private gameSound!:Phaser.Sound.BaseSound;
	private clickSound!:Phaser.Sound.BaseSound;
	private pathfinder!:Easystar.js;
	private grid:number[][] = [];

	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	public constructor(){
		super();
	}


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                            ACCESSORS  DEFINITION                                            |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/

	public get _map(): Phaser.Tilemaps.Tilemap {return this.map;}
	public set _map(newValue: Phaser.Tilemaps.Tilemap) {this.map = newValue;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _mapController(): MapController {return this.mapController;}
	public set _mapController(newValue: MapController) {this.mapController = newValue;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _toolsController(): ToolsController {return this.toolsController;}
	public set _toolsController(newValue: ToolsController) {this.toolsController = newValue;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _marker(): Phaser.GameObjects.Sprite {return this.marker;}


	private setMarker(spriteID?: number | string, spriteSheet?: string): Phaser.GameObjects.Sprite {
		this.marker = this.add.sprite(
			0, 0,
			spriteSheet?spriteSheet:this.spritesets[0],
			spriteID?spriteID:MainScene.markerDefaultID
		);
		this.marker.setOrigin(0, 0);
		return this.marker;
	}

	public changeMarker(spriteID?: number | string | Phaser.Textures.Frame) {
		this.marker.setFrame(spriteID?spriteID:MainScene.markerDefaultID);
	}

	private updateMarkerPosition(): void {
		const pointer = this._pointer;
		this.marker.setPosition(
			this.map.tileToWorldX(pointer.x)!,
			this.map.tileToWorldY(pointer.y)!
		);
	}

  private loadAnimationSprite(path: string|string[]) {
		console.log("Loading Animations...");
		if (typeof(path)==="string") {path = [path];}
		path.forEach(p => {
			let name: string = p.split('/').reverse()[0];
			name = name.substring(0, name.length-4);
      const tmp: string[] = name.split('_');
      const frames: string[] = tmp[3].split('-');
      const fw: number = +frames[0].substring(0,1);
      const fh: number = +frames[0].substring(1,2);
			this.load.spritesheet(name, p, {
				frameWidth: 16*fw,
				frameHeight: 16*fh,
			});
			this.spritesets.push(name);
			console.log(`  → ${name}`);
    });
  }

  private testSpriteAnimation(sprite: string, tile: Point|Phaser.Tilemaps.Tile): Phaser.GameObjects.Sprite {
    const x: number = this.map.tileToWorldX(tile.x) as number;
    const y: number = this.map.tileToWorldY(tile.y) as number;
    const tmp: string[] = sprite.split('_');
    const unit: string = tmp[1];
    const anim: string = tmp[2];
    const frames: string[] = tmp[3].split('-');
    const fw: number = +frames[0].substring(0,1);
    const fh: number = +frames[0].substring(1,2);
    const aw: number = +frames[1].substring(0,1);
    const ah: number = +frames[1].substring(1,2);

    const obj: Phaser.GameObjects.Sprite = this.add.sprite(0,0,sprite,0);
    obj.setOrigin(0,0);
    obj.setPosition(x,y);

    this.anims.create({
      key: sprite,
      frames: this.anims.generateFrameNumbers(sprite),
      frameRate: 8,
      repeat: -1
    });

    obj.play(sprite);
    return obj;
  }

  public moveSprite(obj: Phaser.GameObjects.Sprite, tile: Point) {
    const x: number = this.map.tileToWorldX(tile.x) ?? obj.x;
    const y: number = this.map.tileToWorldY(tile.y) ?? obj.y;
    const dX: number = x - obj.x;
    const dY: number = y - obj.y;
    obj.setPosition(x,y);
  }


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _markerDefaultID(): number | string {return MainScene.markerDefaultID;}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _layers(): Phaser.Tilemaps.TilemapLayer[] {return this.layers;}
	public set _layers(newValue: Phaser.Tilemaps.TilemapLayer[]) {this.layers = newValue;}


	public addAllTiledLayers(tileset?: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[]): void {
		this.map.getTileLayerNames().forEach(layerID => {
			const tilemapLayer: Phaser.Tilemaps.TilemapLayer =
				this.map.createLayer(
					layerID,
					tileset?tileset:Array.from(this.tilesets.keys())
				)!;
			tilemapLayer.setName(layerID);
			this.layers.push(tilemapLayer);
			console.log("A new layer from Tiled has been added to the map:",tilemapLayer)
		});
	}

	public addTiledLayer(
		layerID: string | number,
		tileset?: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[]
	): Phaser.Tilemaps.TilemapLayer | undefined {
		const tiledLayers: string[] = this.map.getTileLayerNames();
		const nbLayers: number = tiledLayers.length;
		if (typeof(layerID)==="number") {
			if (0<layerID && layerID<=nbLayers) 
				layerID = tiledLayers[layerID];
			else return;
		} else if (!tiledLayers.includes(layerID)) return ;
		const tilemapLayer: Phaser.Tilemaps.TilemapLayer =
			this.map.createLayer(
				layerID,
				tileset?tileset:Array.from(this.tilesets.keys())
			)!;
		if (tilemapLayer) {
			tilemapLayer.setName(layerID);
			this.layers.push(tilemapLayer);
			console.log("A new layer from Tiled has been added to the map:",tilemapLayer)
			return tilemapLayer;
		}
	}

	public addNewLayer(
		layerName: string,
		tileset?: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[]
	): Phaser.Tilemaps.TilemapLayer {
		const tilemapLayer: Phaser.Tilemaps.TilemapLayer =
			this.map.createBlankLayer(
				layerName,
				tileset?tileset:Array.from(this.tilesets.keys())
			)!;
		tilemapLayer.setName(layerName);
		this.layers.push(tilemapLayer);
		console.log("A new layer has been created:",tilemapLayer)
		return tilemapLayer;
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _mapSizeXpx(): number {return this.mapSizeXpx;}


	public setMapSizeXpx(): void {
		this.mapSizeXpx = this.map.widthInPixels;
		console.log(`Map Dimension: ${this.mapSizeXpx}px (${this.mapSizeXpx/this.map.tileWidth} x ${this.map.tileWidth}px)`);
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _mapSizeYpx(): number {return this.mapSizeYpx;}

	
	public setMapSizeYpx(): void {
		this.mapSizeYpx = this.map.heightInPixels;
		console.log(`Map Dimension: ${this.mapSizeYpx}px (${this.mapSizeYpx/this.map.tileHeight} x ${this.map.tileHeight}px)`);
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _tilesets(): Map<string,Phaser.Tilemaps.Tileset> {return this.tilesets;}


	private loadTilesets(path: string | string[]): void {
		console.log("Loading Tilesets...");
		if (typeof(path)==="string") {path = [path];}
		path.forEach(p => {
			let name: string = p.split('/').reverse()[0];
			name = name.substring(0, name.length-4);
			let sname: string = 'sprite_'+name;
			this.load.image(name, p);
			this.load.spritesheet(sname, p, {
				frameWidth: 16,
				frameHeight: 16,
			});
			this.tilesets.set(name, null!);
			this.spritesets.push(sname);
			console.log(`  → ${name} (+ '${sname}')`);
		});
	}

	private setTilesets(): void {
		for (let tileset of this.tilesets.keys()) {
			this.tilesets.set(tileset, this.map.addTilesetImage(tileset, tileset)!);
		}
		console.log("Loaded Tilesets:\n",this.tilesets);
		console.log("Loaded SpriteSheets:\n",this.spritesets);
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public get _pointer(): {x: number, y: number} {
		const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
		return {
			x: this.map.worldToTileX(worldPoint.x)!,
			y: this.map.worldToTileY(worldPoint.y)!,
		};
	}
	

	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                           PHASER EXTENDED METHODS                                           |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/

	public preload(): void {
		this.load.tilemapTiledJSON('map', "/mapTiled/Maps/AncientGreece.json");
		this.loadTilesets([
			"/mapTiled/Tileset/Common/User Interface/AllUI.png",
			"/mapTiled/Tileset/Common/Ground/AllGround.png",
			"/mapTiled/Tileset/Common/Miscellaneous/AllMiscellaneous.png",
			"/mapTiled/Tileset/Common/Nature/AllNature.png",
			"/mapTiled/Tileset/Common/Animals/AllAnimals.png",
			"/mapTiled/Tileset/Common/Projectiles/AllProjectiles.png",
			"/mapTiled/Tileset/Others/Buildings/Others_Buildings.png",
			"/mapTiled/Tileset/Others/Units/Ships/Others_Ships.png",
			"/mapTiled/Tileset/Others/Units/Workers/Others_Workers.png",
			"/mapTiled/Tileset/Others/Units/Soldiers/Melee/Others_MeleeSoldiers.png",
			"/mapTiled/Tileset/Others/Units/Soldiers/Mounted/Others_MountedSoldiers.png",
			"/mapTiled/Tileset/Others/Units/Soldiers/Ranged/Others_RangedSoldiers.png",
			"/mapTiled/Tileset/Athens/Buildings/Athens_Buildings.png",
			"/mapTiled/Tileset/Athens/Units/Ships/Athens_Ships.png",
			"/mapTiled/Tileset/Athens/Units/Workers/Athens_Workers.png",
			"/mapTiled/Tileset/Athens/Units/Soldiers/Melee/Athens_MeleeSoldiers.png",
			"/mapTiled/Tileset/Athens/Units/Soldiers/Mounted/Athens_MountedSoldiers.png",
			"/mapTiled/Tileset/Athens/Units/Soldiers/Ranged/Athens_RangedSoldiers.png",
			"/mapTiled/Tileset/Sparta/Buildings/Sparta_Buildings.png",
			"/mapTiled/Tileset/Sparta/Units/Ships/Sparta_Ships.png",
			"/mapTiled/Tileset/Sparta/Units/Workers/Sparta_Workers.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/Sparta_MeleeSoldiers.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Mounted/Sparta_MountedSoldiers.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Ranged/Sparta_RangedSoldiers.png",
			"/mapTiled/Tileset/Thebes/Buildings/Thebes_Buildings.png",
			"/mapTiled/Tileset/Thebes/Units/Ships/Thebes_Ships.png",
			"/mapTiled/Tileset/Thebes/Units/Workers/Thebes_Workers.png",
			"/mapTiled/Tileset/Thebes/Units/Soldiers/Melee/Thebes_MeleeSoldiers.png",
			"/mapTiled/Tileset/Thebes/Units/Soldiers/Mounted/Thebes_MountedSoldiers.png",
			"/mapTiled/Tileset/Thebes/Units/Soldiers/Ranged/Thebes_RangedSoldiers.png",
		]);
    this.loadAnimationSprite([
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_AttackHeavy-ENSW_11-61.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Walk-E_11-51.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Walk-N_11-51.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Walk-S_11-51.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Walk-W_11-51.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Iddle-E_11-21.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Iddle-N_11-21.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Iddle-S_11-21.png",
			"/mapTiled/Tileset/Sparta/Units/Soldiers/Melee/A_General_Iddle-W_11-21.png",
    ]);
		this.load.audio('gameSound', '/audio/audio.mp3');
		this.load.audio('clickSound', '/audio/clickEffect.mp3');
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public create(): void {
		this.setupMap();
		this.setupEvent();

		this.gameSound = this.sound.add('gameSound', {loop:true, volume: 0.5});
		this.clickSound = this.sound.add('clickSound', { volume: 0.8 });
		this.gameSound.play();

		const cursors = this.input.keyboard!.createCursorKeys();
		const controlConfig = {
			camera: this.cameras.main,
			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			speed: 1.0,
			zoomIn: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT),
			zoomOut: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD),
			zoomSpeed: 0.015
		};
		this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
		let gameHtml:HTMLElement = document.getElementById("game")!;
      let mainMenu:HTMLElement = document.getElementById("mainMenu")!;

      gameHtml.classList.toggle("hidden",false);
      mainMenu.classList.toggle("hidden",true);
	  
	  const loadingModal = document.getElementById("loadingModal");
		if (loadingModal) loadingModal.classList.add("hidden");
		mainMenu.classList.remove("blur");
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public update (tile:any, delta:any): void {
		this.updateMarkerPosition();
		this.controls.update(delta);
		this.ourMap.updateCityButtons(this);
	}


	/*
	* +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
	* |  |                                             METHODS  DEFINITION                                             |  | *
	* +--+-------------------------------------------------------------------------------------------------------------+--+ *
	*/
	private setupMap(): void {
		this.map = this.make.tilemap({ key: 'map' });
		this.setTilesets();
		this.addAllTiledLayers();
		this.addNewLayer('User Interface');
		this.setMapSizeXpx();
		this.setMapSizeYpx();
		this.ourMap = new GreekMap(this.map);
		//const mapGrid: Phaser.GameObjects.Graphics = this.drawMapGridLines(1, Phaser.Display.Color.GetColor(23, 23, 23), 0.25);
		this.setMarker();
    //this.testSpriteAnimation("A_General_AttackHeavy-ENSW_11-61",new Point(35,30));
    this.testSpriteAnimation("A_General_Iddle-S_11-21",new Point(35,35));
    //this.testSpriteAnimation("A_General_Walk-N_11-51",new Point(35,34));
    //this.testSpriteAnimation("A_General_Walk-S_11-51",new Point(35,36));
    //this.testSpriteAnimation("A_General_Walk-W_11-51",new Point(34,35));
    //this.testSpriteAnimation("A_General_Walk-E_11-51",new Point(36,35));
	}


	private setupEvent(): void {
		this.mapController = new MapController(this);
		this.toolsController = new ToolsController(this);
		this.input.on('pointerdown', this.mapController.panningStart);
		this.input.on('pointerup', this.mapController.panningStop);
		this.input.on('pointermove', this.mapController.panningMove);
		
		//this.input.on('pointerdown', this.mapController.dragStart);
		//this.input.on('pointerup', this.mapController.dragStop);
		//this.input.on('pointermove', this.mapController.dragMove);
		this.input.on('wheel',this.mapController.zoom);
		this.input.on('pointerdown',this.toolsController.build);

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			if (pointer.leftButtonDown()) {
				const cursor = this._pointer;
				console.log(this.getTileProperties(cursor.x, cursor.y));
				this.clickSound.play();
			}
		});
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public drawMapGridLines(
		lineWidth: number,
		color: number,
		alpha?: number
	): Phaser.GameObjects.Graphics {
		const graphics = this.add.graphics();
		graphics.lineStyle(lineWidth, color, alpha);
		const tileWidth = this.map.tileWidth;
		const tileHeight = this.map.tileHeight;
		const mapWidth = this.map.width;
		const mapHeight = this.map.height;
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
		return graphics.strokePath();
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public getFirstTileAt(
		tileX: number,
		tileY: number,
		layer?: string | number | Phaser.Tilemaps.TilemapLayer
	): Phaser.Tilemaps.Tile | null | undefined {

		let find: boolean = layer!=null?false:true;
		let pos: number = this.layers.length-1;
		if (typeof layer === "string") {
			pos = this.layers.findIndex(l => l.name === layer);
		} else if (typeof layer === "number") {

			pos = (layer<0)?0:(layer>pos)?pos:layer;
		} 
		else if (layer instanceof Phaser.Tilemaps.TilemapLayer) {
			pos = this.layers.indexOf(layer);
		}
		for (let i: integer = this.layers.length-1; i>=0; i--) {
			if (i===pos) {find=true;}
			if (find) {
				const tile = this.map.getTileAt(tileX,tileY,false,this.layers[i]);
				if (tile) {
					return tile;
				}
			}
		}
	}

	public getTileProperties(
		tileX: number,
		tileY: number,
		layer?: string | number | Phaser.Tilemaps.TilemapLayer
	): Object | undefined {
		const tile: Phaser.Tilemaps.Tile = this.getFirstTileAt(tileX, tileY, layer)!;
		let properties: Object = tile.properties;
		Object.assign(properties, {ID: tile.index}, tile.getTileData());
		if (tile) return properties;
	}
}