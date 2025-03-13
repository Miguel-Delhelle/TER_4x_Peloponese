import mainTile from '../../assets/tiled/Tileset/Ground.png';
import mapJson from '../../assets/tiled/Greece.json';
import treeTile from '../../assets/tiled/Tileset/MiniWorldSprites/Nature/Trees.png'
import allAssetsTile from '../../assets/tiled/Tileset/MiniWorldSprites/AllAssetsPreview.png'
import { MapController } from '../controller/MapController';


export class MainScene extends Phaser.Scene{

    map:Phaser.Tilemaps.Tilemap;
    mapController:MapController;

    constructor(){
        super();
    }

    preload () {
      this.mapController = new MapController(this.cameras.main);
      this.load.image('tiles', mainTile);
      this.load.image('tileTree', treeTile);
      this.load.image('allAssetsTile', allAssetsTile);

      this.load.tilemapTiledJSON('map', mapJson);
    }
    
    create () {        
        this.map = this.make.tilemap({ key: 'map' });
        const tiles = this.map.addTilesetImage('Ground', 'tiles');
        const tileTree = this.map.addTilesetImage('Trees', 'tileTree');
        const tileAsset = this.map.addTilesetImage('AllAssetsPreview', 'allAssetsTile');

        const layer0 = this.map.createLayer('Plains', tiles, 0, 0);
        const layer1 = this.map.createLayer('Cliff', tiles, 0, 0);
        const layer2 = this.map.createLayer('Objects', [tileTree,tileAsset], 0, 0);
        this.setupEvent();

    }
    
    setupEvent(){
      this.input.on('pointerdown', this.mapController.dragStart);
      this.input.on('pointerup', this.mapController.dragStop);
      this.input.on('pointermove', this.mapController.dragMove);
    }
    
    update () {
    }

    public get _camera(){
        return this.cameras;
    }
    

}