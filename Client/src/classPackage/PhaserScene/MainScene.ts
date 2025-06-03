//import mapPng from '../../../res/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png';
//import mapJson from '/mapTiled/Maps/Test.json';
//import mapPng from '/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png'
import { MapController } from '../Controller/MapController';
import { ToolsController } from '../Controller/ToolsController';
import Phaser from 'phaser';
import { GreekMap } from './Map/GreekMap';
import { HTML } from '../..';
import { PathFinder } from '../Controller/Pathfinding';
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

	private gameSound!:Phaser.Sound.BaseSound;
	private clickSound!:Phaser.Sound.BaseSound;
	private grid:number[][] = [];
	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
	private pathFinder!: PathFinder;

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
		this.load.tilemapTiledJSON('map', "/mapTiled/Maps/AncientGreece2.json");
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

		let gameScene: HTMLElement = document.getElementById("GameScene") as HTMLElement;
    let mainMenu: HTMLElement = document.getElementById("MainMenu") as HTMLElement;
    let loadingScreen: HTMLElement = document.getElementById("LoadingScreen") as HTMLElement;
    HTML.toggleClass([gameScene,mainMenu,loadingScreen],'hidden');
	}


	//       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

	public update (tile:any, delta:any): void {
		this.updateMarkerPosition();
		this._mapController.controls.update(delta);
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
		//this.addNewLayer('User Interface');
		this.setMapSizeXpx();
		this.setMapSizeYpx();
		this.ourMap = new GreekMap(this.map);

		this.setMarker();
		this.pathFinder = new PathFinder(this.map, this.layers,this.ourMap);
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

    let isFinding: boolean = false;
    let currentPath: any = null;
    const section = document.getElementById("GameScene") as HTMLElement;
    const btnPath = section.querySelector("#btn-path") as HTMLButtonElement;
    const btnRecruit = section.querySelector("#btn-recruit") as HTMLButtonElement;
    const btnBuild = section.querySelector("#btn-build") as HTMLButtonElement;

    btnPath.addEventListener('click', () => {
      if(isFinding) return;
      if(currentPath instanceof Phaser.GameObjects.Graphics) currentPath.destroy();
      isFinding=true;
      let start: Point|null = null;
      let end: Point|null = null;
      console.log("Starting a new path finder:\nPlease select the starting tile on the map");
      btnPath.textContent = "Pathfinding: Select a tile (path's start)";
      this.input.on('pointerdown', () => {
        if(!isFinding) return;
        const cursor = this._pointer;
        if(!start) {
          start = new Point(cursor.x, cursor.y);
          console.log("Please select the ending tile on the map");
          btnPath.textContent = "Pathfinding: Select a tile (path's end)";
        } else if(!end) {
          end = new Point(cursor.x, cursor.y);
          btnPath.textContent = "Pathfinding: Processing...";
          const path = this.testPathfinding(start,end);
          currentPath = path ?? currentPath;
          console.log("End of the current path finder");
          btnPath.textContent = "Pathfinding (test)";
          start=null;end=null;isFinding=false;
        }
      });
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

	public drawPath(path: { x: number, y: number }[], color: number = 0xff0000): Phaser.GameObjects.Graphics {
    const graphics = this.add.graphics();
    graphics.lineStyle(4, color, 1);

    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const tileWidth = this.map.tileWidth;
        const tileHeight = this.map.tileHeight;
        const fromX = from.x * tileWidth + tileWidth / 2;
        const fromY = from.y * tileHeight + tileHeight / 2;
        const toX = to.x * tileWidth + tileWidth / 2;
        const toY = to.y * tileHeight + tileHeight / 2;
        graphics.moveTo(fromX, fromY);
        graphics.lineTo(toX, toY);
    }
    return graphics.strokePath();
  }

  public testPathfinding(start: Point, end: Point): Phaser.GameObjects.Graphics|null {
    const startTile = this.ourMap.staticMatrice[start.x][start.y];
    const endTile = this.ourMap.staticMatrice[end.x][end.y];
    if (startTile.terrain.isObstacle || endTile.terrain.isObstacle) {
      const err: string = "Impossible to initiate a path starting or ending on an obstacle, please try again";
      console.error(err)
      alert(err);
      return null;
    }
    let mode: 'land'|'sea'|undefined;
    if (startTile.terrain.isWalkingEnabled && endTile.terrain.isWalkingEnabled) mode='land';
    if (startTile.terrain.isSailingEnabled && endTile.terrain.isSailingEnabled) mode='sea';
    if (!mode) {
      const err: string = "Impossible to initiate a path starting on land and ending into the ocean or the other way around, please try again";
      console.error(err)
      alert(err);
      return null;
    }
    const result = this.pathFinder.findPathAStar(start.x, start.y, end.x, end.y,mode);
    if (result) {
			console.warn("A path has been found :", result.path, "Cost :", result.cost);
			return this.drawPath(result.path);
		} else {
      const err: string = `There is no path between these 2 points: ${start} -> ${end}...`;
			console.error(err);
      alert(err);
      return null;
    }
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
		console.log("x: ",tileX,"y: ",tileY);
		if (tile) return properties;
	}
}