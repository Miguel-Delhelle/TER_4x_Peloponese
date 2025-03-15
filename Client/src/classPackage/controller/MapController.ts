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

    zoomIn = (pointer: Phaser.Input.Pointer): void => {
        this.camera.zoom;
    }

    zoomOut = (pointer: Phaser.Input.Pointer): void => {

    }
}