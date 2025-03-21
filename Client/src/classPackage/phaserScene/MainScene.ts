//import mapPng from '../../../res/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png';
//import mapJson from '/mapTiled/Maps/Test.json';
//import mapPng from '/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png'
import { MapController } from '../controller/MapController';
import { ToolsController } from '../controller/ToolsController';



export class MainScene extends Phaser.Scene{
   /*
   * +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
   * |  |                                            ATTRIBUTES DEFINITION                                            |  | *
   * +--+-------------------------------------------------------------------------------------------------------------+--+ *
   */
   private map: Phaser.Tilemaps.Tilemap;
   private mapController: MapController;
   private toolsController: ToolsController;
   private marker: Phaser.GameObjects.Sprite;
   private layers: Phaser.Tilemaps.TilemapLayer[] = [];
   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //
   private tilesets: Map<string,Phaser.Tilemaps.Tileset> = new Map<string,Phaser.Tilemaps.Tileset>();
   private spritesets: string[] = [];
  
   /*
   * +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
   * |  |                                           CONSTRUCTORS DEFINITION                                           |  | *
   * +--+-------------------------------------------------------------------------------------------------------------+--+ *
   */
   public constructor(){
      super();
      // Allez à la méthode preload(), une extension de phaser, pour obtenir les préload normalement mis dans le constructeur. 
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

   private setMarker(spriteID: number, spriteSheet: string): Phaser.GameObjects.Sprite {
      this.marker = this.add.sprite(0,0,spriteSheet,spriteID);
      this.marker.setOrigin(0, 0);
      return this.marker;
   }
   private updateMarkerPosition(): void {
      const pointer = this._pointer;
      this.marker.setPosition(
         this.map.tileToWorldX(pointer.x),
         this.map.tileToWorldY(pointer.y)
      );
   }

   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

   public get _layers(): Phaser.Tilemaps.TilemapLayer[] {return this.layers;}
   public set _layers(newValue: Phaser.Tilemaps.TilemapLayer[]) {this.layers = newValue;}

   public addAllTiledLayers(tileset?: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[]): void {
      this.map.getTileLayerNames().forEach(layerID => {
         const tilemapLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(layerID, tileset?tileset:Array.from(this.tilesets.keys()));
         tilemapLayer.setName(layerID);
         this.layers.push(tilemapLayer);
      });
   }

   public addTiledLayer(
      layerID: string | number,
      tileset?: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[]
   ): Phaser.Tilemaps.TilemapLayer {
      const tiledLayers: string[] = this.map.getTileLayerNames();
      const nbLayers: number = tiledLayers.length;
      if (typeof(layerID)==="number") {
         if (0<layerID && layerID<=nbLayers) 
            layerID = tiledLayers[layerID];
         else return;
      } else if (!tiledLayers.includes(layerID)) return;
      const tilemapLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(layerID, tileset?tileset:Array.from(this.tilesets.keys()));
      if (tilemapLayer) {
         tilemapLayer.setName(layerID);
         this.layers.push(tilemapLayer);
         return tilemapLayer;
      }
   }

   public addNewLayer(
      layerName: string,
      tileset?: string | string[] | Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[]
   ): Phaser.Tilemaps.TilemapLayer {
      const tilemapLayer: Phaser.Tilemaps.TilemapLayer = this.map.createBlankLayer(layerName, tileset?tileset:Array.from(this.tilesets.keys()));
      tilemapLayer.setName(layerName);
      this.layers.push(tilemapLayer);
      return tilemapLayer;
   }

   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

   public get _tilesets(): Map<string,Phaser.Tilemaps.Tileset> {return this.tilesets;}
  
   private loadTilesets(path: string | string[]): void {
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
         this.tilesets.set(name, null);
         this.spritesets.push(sname);
      });
   }

   private setTilesets(): void {
      for (let tileset of this.tilesets.keys()) {
         this.tilesets.set(tileset, this.map.addTilesetImage(tileset, tileset));
      }
   }

   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

   public get _pointer(): {x: number, y: number} {
      const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
      return {
         x: this.map.worldToTileX(worldPoint.x),
         y: this.map.worldToTileY(worldPoint.y),
      };
   }
  
   /*
   * +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
   * |  |                                           PHASER EXTENDED METHODS                                           |  | *
   * +--+-------------------------------------------------------------------------------------------------------------+--+ *
   */
   public preload(): void {
      this.mapController = new MapController(this);
      this.toolsController = new ToolsController(this);
      this.load.tilemapTiledJSON('map', '/mapTiled/Maps/Test.json');
      this.loadTilesets("/mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png");
      this.load.tilemapTiledJSON('mapJSON', "/mapTiled/Maps/Test.json");
   }

   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

   public create(): void {
      this.map = this.make.tilemap({ key: 'mapJSON' });
      this.setTilesets();
      this.addAllTiledLayers();
      this.addNewLayer('User Interface');

      const mapGrid: Phaser.GameObjects.Graphics = this.drawMapGridLines(1, Phaser.Display.Color.GetColor(23, 23, 23), 0.25);
      this.setMarker(4336, this.spritesets[0]);

      this.setupEvent();
   }

   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

   public update (tile, delta): void {
      this.updateMarkerPosition();
   }

   /*
   * +--+---------------------------------------------{ Class Separator }---------------------------------------------+--+ *
   * |  |                                             METHODS  DEFINITION                                             |  | *
   * +--+-------------------------------------------------------------------------------------------------------------+--+ *
   */
   private setupEvent(): void {
      this.input.on('pointerdown', this.mapController.dragStart);
      this.input.on('pointerup', this.mapController.dragStop);
      this.input.on('pointermove', this.mapController.dragMove);
      this.input.on('wheel',this.mapController.zoom);;
      this.input.on('pointerdown',this.toolsController.build)

      this.input.on('pointerdown', e => {
         const pointer = this._pointer;
         console.log(this.getTileProperties(pointer.x, pointer.y));
      })
   }

   //       +----------------------------------------{ $Section separator$ }----------------------------------------+     //

   public drawMapGridLines(lineWidth: number, color: number, alpha?: number): Phaser.GameObjects.Graphics {
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

   public getFirstTileAt(tileX: number, tileY: number, nonNull?: boolean, layer?: string | number | Phaser.Tilemaps.TilemapLayer): Phaser.Tilemaps.Tile | null {
      let find: boolean = layer!=null?false:true;
      let pos: number = this.layers.length-1;
      if (typeof layer === "string") {
         pos = this.layers.findIndex(l => l.name === layer);
      } else if (typeof layer === "number") {
         pos = (layer<0)?0:(layer>pos)?pos:layer;
      } else if (layer instanceof Phaser.Tilemaps.TilemapLayer) {
         pos = this.layers.indexOf(layer);
      }
      for (let i: integer = this.layers.length-1; i>=0; i--) {
         if (i===pos) {find=true;}
         if (find) {
            const tile = this.map.getTileAt(tileX,tileY,nonNull,this.layers[i]);
            if (tile) {
               return tile;
            }
         }
      }
   }
   
   public getTileProperties(tileX: number, tileY: number, layer?: string | number | Phaser.Tilemaps.TilemapLayer): Object {
      const tile: Phaser.Tilemaps.Tile = this.getFirstTileAt(tileX, tileY, false, layer);
      let properties: Object = tile.properties;
      Object.assign(properties, {ID: tile.index}, tile.getTileData());
      if (tile) return properties;
   }

}