import { MainScene } from "../phaserScene/MainScene";
import Phaser from "phaser";


export class MapController {

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private scene:MainScene;
  private camera:Phaser.Cameras.Scene2D.Camera;

  constructor(scene:MainScene) {
    this.scene = scene;
    this.camera = this.scene.cameras.main;
  }

  dragStart = (pointer: Phaser.Input.Pointer): void => {
    this.isDragging = true;
    this.dragStartX = pointer.x;
    this.dragStartY = pointer.y;
  };

  dragStop = (pointer: Phaser.Input.Pointer): void => {
    this.isDragging = false;
  };

  dragMove = (pointer: Phaser.Input.Pointer): void => {
    if (this.isDragging) {
      const deltaX = pointer.x - this.dragStartX;
      const deltaY = pointer.y - this.dragStartY;
      this.camera.scrollX -= deltaX / this.camera.zoom;
      this.camera.scrollY -= deltaY / this.camera.zoom;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
    }
  };

  zoom = (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    // Get the current world point under pointer.
    const worldPoint = this.camera.getWorldPoint(pointer.x, pointer.y);
    const newZoom = this.camera.zoom - this.camera.zoom * 0.001 * deltaY;
    this.camera.zoom = Phaser.Math.Clamp(newZoom, 0.25, 2);
    console.log("fonction zoom lancée")
    // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
    this.camera.preRender();
    
    const newWorldPoint = this.camera.getWorldPoint(pointer.x, pointer.y);
    // Scroll the camera to keep the pointer under the same world point.
    this.camera.scrollX -= newWorldPoint.x - worldPoint.x;
    this.camera.scrollY -= newWorldPoint.y - worldPoint.y; 
  };


  public get _isDragging(){
    return this.isDragging;
  }

}