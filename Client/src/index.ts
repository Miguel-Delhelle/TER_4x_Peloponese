
//                                      -  -- Imports --  -                                      //

import type { SocketIOClient } from "common";
import { MainScene } from "./classPackage/PhaserScene/MainScene";
import { startMainMenu } from "./scp_mainMenu";
import type { IPlayer, IGameRoom } from "common";

// +-------------------------------------------------------------------------------------------+ //
//                                       -  -- Types --  -                                       //

const TAA_HTMLDisablingElement = [
  HTMLButtonElement,
  HTMLFieldSetElement,
  HTMLInputElement,
  HTMLOptGroupElement,
  HTMLOptionElement,
  HTMLSelectElement,
  HTMLTextAreaElement,
] as const;
export type HTMLDisablingElement = InstanceType<typeof TAA_HTMLDisablingElement[number]>;
export type anyHTMLDisablingElement =
  | HTMLDisablingElement
  | HTMLDisablingElement[]
  | NodeListOf<HTMLDisablingElement>;

export type anyHTMLElement =
  HTMLElement|
  HTMLElement[]|
  NodeListOf<HTMLElement>;

type HTML = {
  readonly URI: string,
  readonly defaultUser: string,
  readonly mainScene: MainScene,
  socket?: SocketIOClient,
  currentUser?: IPlayer,
  currentRoom?: IGameRoom,

  toggleDisabled: (HTMLElements: anyHTMLElement, value?: boolean) => void,
  toggleClass: (HTMLElements: anyHTMLElement, className: string|string[], value?: boolean) => void,
  startGame: () => void,
}


// +-------------------------------------------------------------------------------------------+ //
//                                      -  -- Exports --  -                                      //

export const HTML: HTML = {
  URI: "http://localhost:3000",
  defaultUser: "[Not connected...]",
  mainScene: new MainScene(),

  toggleDisabled: (HTMLElements: anyHTMLElement, value?: boolean): void => {
    if(HTMLElements instanceof HTMLElement) HTMLElements = [HTMLElements];
    HTMLElements.forEach(obj => {
      if(TAA_HTMLDisablingElement.some(e => obj instanceof e)) {
        value = value ?? !(obj as HTMLDisablingElement).disabled;
        (obj as HTMLDisablingElement).disabled = value;
      }
      obj.classList.toggle('disabled', value);
    });
  },
  toggleClass: (HTMLElements: anyHTMLElement, className: string|string[], value?: boolean): void => {
    if(HTMLElements instanceof HTMLElement) HTMLElements = [HTMLElements];
    if(!(className instanceof Array)) className = [className];
    HTMLElements.forEach(obj => {
      className.forEach(cn => {
        obj.classList.toggle(cn, value);
      })
    });
  },
  startGame: (): void => {
    const loadingScreen: HTMLElement|null = document.querySelector(`#LoadingScreen`);
    if(loadingScreen) HTML.toggleClass(loadingScreen, 'hidden', false);
    
    const config:Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game',
      pixelArt: true
    };
    var game: Phaser.Game = new Phaser.Game(config);
    game.scene.add('mainScene', HTML.mainScene, true);
  }
}


// +-------------------------------------------------------------------------------------------+ //
//                                  -  -- Initialisation --  -                                   //

document.addEventListener("DOMContentLoaded", startMainMenu);