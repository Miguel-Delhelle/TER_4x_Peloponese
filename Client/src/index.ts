
//                                      -  -- Imports --  -                                      //

import { MainScene } from "./classPackage/PhaserScene/MainScene";
import { startMainMenu } from "./scp_mainMenu";
//import { Player } from "./classPackage/Player/player";

// +-------------------------------------------------------------------------------------------+ //
//                                       -  -- Types --  -                                       //

export type HTMLDisablingElement = 
  HTMLButtonElement|
  HTMLFieldSetElement|
  HTMLInputElement|
  HTMLOptGroupElement|
  HTMLOptionElement|
  HTMLSelectElement|
  HTMLTextAreaElement;

export type Player = {
  username: string,
  socket: SocketIOClient.Socket,
  faction?: string,
}

export type GameRoom = {
  id: string,
  player1?: Player,
  player2?: Player,
  player3?: Player,
}

type HTML = {
  readonly URI: string,
  readonly defaultUser: string,
  readonly mainScene: MainScene,
  socket: SocketIOClient.Socket|null,
  currentUser?: Player|string,
  currentRoom?: GameRoom|string,

  toggleDisabled: (
    HTMLElements: HTMLDisablingElement|HTMLDisablingElement[]|NodeListOf<HTMLDisablingElement>, 
    value?: boolean
  ) => void,
  toggleClass: (
    HTMLElements: HTMLElement|HTMLElement[]|NodeListOf<HTMLElement>,
    className: string|string[],
    value?: boolean
  ) => void,
  startGame: () => void,
}


// +-------------------------------------------------------------------------------------------+ //
//                                      -  -- Exports --  -                                      //

export const HTML: HTML = {
  URI: "http://localhost:3000",
  defaultUser: "[Not connected...]",
  mainScene: new MainScene(),
  socket: null,

  toggleDisabled: (
    HTMLElements: HTMLDisablingElement|HTMLDisablingElement[]|NodeListOf<HTMLDisablingElement>, 
    value?: boolean
  ): void => {
    if(!(HTMLElements instanceof Array) && !(HTMLElements instanceof NodeList)) HTMLElements = [HTMLElements];
    HTMLElements.forEach(obj => {
      //value = value ?? !obj.disabled;
      //obj.disabled = value;
      obj.classList.toggle('disabled', value);
    });
  },
  toggleClass: (
    HTMLElements: HTMLElement|HTMLElement[]|NodeListOf<HTMLElement>,
    className: string|string[],
    value?: boolean
  ): void => {
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