import mapPng from '../../../../mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png';
import mapJson from '../../../../mapTiled/Maps/Test.json';
import { MapController } from '../controller/MapController';
import { ToolsController } from '../controller/ToolsController';


export class MainScene extends Phaser.Scene{

  private map: Phaser.Tilemaps.Tilemap;
  private mapController: MapController;
  private toolsController: ToolsController;
  private marker: Phaser.GameObjects.Sprite;
  private layers: Phaser.Tilemaps.TilemapLayer[] = [];

  constructor(){
      super();
  }

  preload () {
    this.mapController = new MapController(this);
    this.toolsController = new ToolsController(this);
    this.load.tilemapTiledJSON('map', mapJson);
    this.load.image('mapPNG', mapPng);
    this.load.spritesheet("spritePNG", mapPng, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.tilemapTiledJSON('mapJSON', mapJson);
  }
  
  create () {
    this.map = this.make.tilemap({ key: 'mapJSON' });
    const tiles = this.map.addTilesetImage('AllMiniWorldSprites', 'mapPNG');
    let i: number = 0;
    for (let name of this.map.getTileLayerNames()) {
      this.layers[i] = this.map.createLayer(name, tiles);
      this.layers[i].setName(name);
      i++;
    }
    const name: string = 'User Interface';
    this.layers[i] = this.map.createBlankLayer(name, tiles);
    this.layers[i].setName(name);

    this.marker = this.add.sprite(0,0,"spritePNG",4336);
    this.marker.setOrigin(0, 0);

    this.setupEvent();
  }
  
  setupEvent(){
    this.input.on('pointerdown', this.mapController.dragStart);
    this.input.on('pointerup', this.mapController.dragStop);
    this.input.on('pointermove', this.mapController.dragMove);
    this.input.on('wheel',this.mapController.zoom);;
    this.input.on("pointerdown",this.toolsController.build)
  }
  
  update (tile, delta) {
    const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
    // Rounds down to nearest tile
    const pointerTileX = this.map.worldToTileX(worldPoint.x);
    const pointerTileY = this.map.worldToTileY(worldPoint.y);
    // Snap to tile coordinates, but in world space
    this.marker.setPosition(
      this.map.tileToWorldX(pointerTileX),
      this.map.tileToWorldY(pointerTileY)
    );
    if (this.input.manager.activePointer.isDown) {
      const tile = this.getFirstTileAt(pointerTileX, pointerTileY);
      if (tile) {
        console.log(`Properties (x:${pointerTileX}, y:${pointerTileY}, layer:${tile.layer.name}): ${JSON.stringify(tile.properties)}`);
      }
    } 
  } 
  public get _camera(){
      return this.cameras;
  }

    public get _map(){
      return this.map;
    }

    public get _pointer(){
      let worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);
      let pointerTileX = this.map.worldToTileX(worldPoint.x);
      let pointerTileY = this.map.worldToTileY(worldPoint.y);

      return {"x":pointerTileX,"y":pointerTileY}
    }

    public get _mapController(){
      return this.mapController;
    }
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
}