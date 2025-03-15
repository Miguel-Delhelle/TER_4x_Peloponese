import mapPng from '../../../../mapTiled/Tileset/MiniWorldSprites/AllMiniWorldSprites.png';
import mapJson from '../../../../mapTiled/Maps/Test.json';
import { MapController } from '../controller/MapController';


export class MainScene extends Phaser.Scene{

    private map: Phaser.Tilemaps.Tilemap;
    private mapController: MapController;
    private marker;
    private layers: Phaser.Tilemaps.TilemapLayer[] = [];

    constructor(){
        super();
    }

    preload () {
      this.mapController = new MapController(this);
      this.load.tilemapTiledJSON('map', mapJson);
      this.load.image('mapPNG', mapPng);
      this.load.tilemapTiledJSON('mapJSON', mapJson);
    }
    
    create () {
        this.map = this.make.tilemap({ key: 'mapJSON' });
        const tiles = this.map.addTilesetImage('AllMiniWorldSprites', 'mapPNG');
       // const tileTree = this.map.addTilesetImage('Trees', 'tileTree');
       // const tileAsset = this.map.addTilesetImage('AllAssetsPreview', 'allAssetsTile');

        this.layers[0] = this.map.createLayer('Landscape', tiles, 0, 0);
        this.layers[1] = this.map.createLayer('Roads', tiles, 0, 0);
        this.layers[2] = this.map.createLayer('Topography', tiles, 0, 0);
        this.layers[3] = this.map.createLayer('Details', tiles, 0, 0);
        this.layers[4] = this.map.createLayer('Characters', tiles, 0, 0);
        this.layers[5] = this.map.createBlankLayer('User Interface', tiles);
        this.setupEvent();
        //this.marker = this.map.putTileAt(4338,0,0);
        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0x000000, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth * this.layers[0].scaleX, this.map.tileHeight * this.layers[0].scaleY);

    }
    
    setupEvent(){
      this.input.on('pointerdown', this.mapController.dragStart);
      this.input.on('pointerup', this.mapController.dragStop);
      this.input.on('pointermove', this.mapController.dragMove);
      this.input.on('wheel',this.mapController.zoom)
    }
    
    update (tile, delta) {
      const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);

      // Rounds down to nearest tile
      const pointerTileX = this.map.worldToTileX(worldPoint.x);
      const pointerTileY = this.map.worldToTileY(worldPoint.y);

      // Snap to tile coordinates, but in world space
      this.marker.x = this.map.tileToWorldX(pointerTileX);
      this.marker.y = this.map.tileToWorldY(pointerTileY);

      if (this.input.manager.activePointer.isDown) {
        const tile = this.getFirstTileAt(pointerTileX, pointerTileY);
        if (tile) {
          console.log(`Properties (x:${pointerTileX}, y:${pointerTileY}, layer:${tile.layer.name}): ${JSON.stringify(tile.properties)}`);
        }
        //const tile = this.map.getTileAt(pointerTileX,pointerTileY, false, this.layers[0]);
        //console.log(`Properties (x:${pointerTileX}, y:${pointerTileY}, layer:${this.layers[0].name}): ${JSON.stringify(tile.properties)}`);

      }
    }

    public get _camera(){
        return this.cameras;
    }

    public getFirstTileAt(tileX: number, tileY: number, nonNull?: boolean, layer?: string | number | Phaser.Tilemaps.TilemapLayer): Phaser.Tilemaps.Tile | null {
      for (let i: integer = this.layers.length-1; i>=0; i--) {
        const tile = this.map.getTileAt(tileX,tileY,nonNull,this.layers[i]);
        if (tile) {
          return tile;
        }
      }
      /*
      let find: boolean = layer?false:true;
      for (let i: integer = this.layers.length-1; i==0; i--) {
        const tile = this.map.getTileAt(tileX, tileY, nonNull, this.layers[i]);
        if (tile.layer.name == this.layers[i].name) {
          find = true;
        }
        if (find && tile) {
          return tile;
        }
      }
      return;
      */
    }

}