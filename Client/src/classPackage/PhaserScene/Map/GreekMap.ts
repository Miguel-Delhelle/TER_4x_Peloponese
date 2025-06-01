import { Tile } from "./Tile";
import { Point } from "../../Math/Point";
import { Terrain } from "./Terrain";
import { FACTION, parseEnum } from "../../Entity/EFaction";
import type { MainScene } from "../MainScene";
import { HTML } from "../../..";
import { Data } from "phaser";

interface CityUIButton {
   phaserTile: Phaser.Tilemaps.Tile;
   button: HTMLButtonElement;
   ourTile: Tile;
   centerPosition: Point;
}

interface CityGroup {
   tiles: Phaser.Tilemaps.Tile[];
   centerTile: Phaser.Tilemaps.Tile;
   centerPosition: Point;
   faction: string;
}

export class GreekMap {
   public map: Phaser.Tilemaps.Tilemap;
   public dynamicMatrice: Tile[][] = [];
   public staticMatrice: (Tile | null)[][] = [];
   public cityButtons: CityUIButton[] = [];
   public cityGroups: CityGroup[] = [];
   private processedCityTiles: Set<string> = new Set();

   private readonly CITY_INFLUENCE_RADIUS = 20;
   private readonly LAYERS = {
      MOUNTAINS: "Montains",
      HILLS: "Hills",
      LANDSCAPE: "Landscape",
      UNITS: "Units",
      BUILDINGS: "Buildings",
      ROAD: "Road"
   } as const;

   constructor(map: Phaser.Tilemaps.Tilemap) {
      this.map = map;
      this.initialize();
   }

   private initialize(): void {
      this.initStaticMatrice();
      this.initDynamicMatrice();
      this.processCityGroups(); // Process cities after matrices are built
      // Uncomment these lines if needed for debugging
      // downloadJSON(this.dynamicMatrice, "startDynamicMatrice.json");
      // downloadJSON(this.staticMatrice, "startStaticMatrice.json");
   }

   public initStaticMatrice(): void {
      const terrains: Terrain[] = [];
      
      this.map.getLayer(this.LAYERS.MOUNTAINS)?.tilemapLayer.forEachTile(tile => {
         const x: number = tile.x;
         const y: number = tile.y;
         
         // Get the appropriate tile (Mountains > Hills > Landscape)
         if (tile.index === -1) {
            const hillTile = this.map.getTileAt(x, y, false, this.LAYERS.HILLS);
            if (hillTile) {
               tile = hillTile;
            } else {
               const landscapeTile = this.map.getTileAt(x, y, false, this.LAYERS.LANDSCAPE);
               if (landscapeTile) tile = landscapeTile;
            }
         }
        
         if (!this.staticMatrice[x]) this.staticMatrice[x] = [];

         const props: any = tile.tileset?.getTileProperties(tile.index);
         const dataProps: any = tile.getTileData();
         
         const tileID: Point = new Point(tile.x, tile.y);
         const terrain: Terrain = new Terrain(
            props?.IsBuildingEnabled ?? false,
            props?.IsFarmingEnabled ?? false,
            props?.IsWalkingEnabled ?? false,
            props?.MovementCost ?? -1,
            dataProps?.type ?? "error cc"
         );
         
         this.staticMatrice[x][y] = new Tile(tileID, terrain);
      });
   }

   public initDynamicMatrice(): void {
      this.map.getLayer(this.LAYERS.UNITS)?.tilemapLayer.forEachTile(tile => {
         const x: number = tile.x;
         const y: number = tile.y;
         
         // Get the appropriate tile (Units > Buildings > Road)
         if (tile.index === -1) {
            const buildingTile = this.map.getTileAt(x, y, false, this.LAYERS.BUILDINGS);
            if (buildingTile) {
               tile = buildingTile;
            } else {
               const roadTile = this.map.getTileAt(x, y, false, this.LAYERS.ROAD);
               if (roadTile) tile = roadTile;
            }
         }
        
         if (!this.dynamicMatrice[x]) this.dynamicMatrice[x] = [];
         
         let props: any;
         let dataProps: any;
         let faction: string = "Wilderness";
         
         if (tile) {
            props = tile.tileset?.getTileProperties(tile.index);
            dataProps = tile.getTileData();
         }

         if (props) {
            const tileID: Point = new Point(tile.x, tile.y);
            const terrain: Terrain = new Terrain(
               props.IsBuildingEnabled ?? false,
               props.IsFarmingEnabled ?? false,
               props.IsWalkingEnabled ?? false,
               props.MovementCost ?? -1,
               dataProps?.type ?? "error cc"
            );
            
            // Handle faction assignment
            faction = props.Faction ?? "Wilderness";
            
            const tmpOurTile = new Tile(tileID, terrain, faction);
            this.dynamicMatrice[x][y] = tmpOurTile;
            
            // Store city tiles for later processing
            if (dataProps?.type === "Cities") {
               // We'll process cities after all tiles are loaded
               const tileKey = `${x},${y}`;
               if (!this.processedCityTiles.has(tileKey)) {
                  this.processedCityTiles.add(tileKey);
               }
            }
         }
      });
   }

   private processCityGroups(): void {
      const visitedTiles = new Set<string>();
      
      // Find all city tiles and group them
      this.processedCityTiles.forEach(tileKey => {
         if (visitedTiles.has(tileKey)) return;
         
         const [x, y] = tileKey.split(',').map(Number);
         const cityTiles = this.findConnectedCityTiles(x, y, visitedTiles);
         
         if (cityTiles.length > 0) {
            const centerTile = this.findCenterTile(cityTiles);
            const centerPosition = new Point(
               Math.round(cityTiles.reduce((sum, tile) => sum + tile.x, 0) / cityTiles.length),
               Math.round(cityTiles.reduce((sum, tile) => sum + tile.y, 0) / cityTiles.length)
            );
            
            // Get faction from any tile in the group
            const firstTile = cityTiles[0];
            const ourTile = this.dynamicMatrice[firstTile.x]?.[firstTile.y];
            const faction = ourTile?._faction || "Unknown";
            
            const cityGroup: CityGroup = {
               tiles: cityTiles,
               centerTile,
               centerPosition,
               faction
            };
            
            this.cityGroups.push(cityGroup);
            this.initCitiesListener(centerTile, HTML.mainScene, ourTile, cityGroup);
         }
      });
   }

   private findConnectedCityTiles(startX: number, startY: number, visitedTiles: Set<string>): Phaser.Tilemaps.Tile[] {
      const cityTiles: Phaser.Tilemaps.Tile[] = [];
      const toVisit: Point[] = [new Point(startX, startY)];
      const localVisited = new Set<string>();
      
      while (toVisit.length > 0) {
         const current = toVisit.pop()!;
         const key = `${current.x},${current.y}`;
         
         if (localVisited.has(key) || visitedTiles.has(key)) continue;
         
         // Check if this tile is a city tile
         const tile = this.getCityTileAt(current.x, current.y);
         if (!tile) continue;
         
         localVisited.add(key);
         visitedTiles.add(key);
         cityTiles.push(tile);
         
         // Check adjacent tiles (4-directional)
         const directions = [
            new Point(current.x + 1, current.y),
            new Point(current.x - 1, current.y),
            new Point(current.x, current.y + 1),
            new Point(current.x, current.y - 1)
         ];
         
         directions.forEach(dir => {
            const dirKey = `${dir.x},${dir.y}`;
            if (!localVisited.has(dirKey) && this.processedCityTiles.has(dirKey)) {
               toVisit.push(dir);
            }
         });
      }
      
      return cityTiles;
   }

   private getCityTileAt(x: number, y: number): Phaser.Tilemaps.Tile | null {
      // Try to get tile from different layers
      let tile = this.map.getTileAt(x, y, false, this.LAYERS.UNITS);
      if (tile && tile.index !== -1) {
         const dataProps:any = tile.getTileData();
         if (dataProps?.type === "Cities") return tile;
      }
      
      tile = this.map.getTileAt(x, y, false, this.LAYERS.BUILDINGS);
      if (tile && tile.index !== -1) {
         const dataProps:any = tile.getTileData();
         if (dataProps?.type === "Cities") return tile;
      }
      
      return null;
   }

   private findCenterTile(tiles: Phaser.Tilemaps.Tile[]): Phaser.Tilemaps.Tile {
      // Find the tile closest to the geometric center
      const centerX = tiles.reduce((sum, tile) => sum + tile.x, 0) / tiles.length;
      const centerY = tiles.reduce((sum, tile) => sum + tile.y, 0) / tiles.length;
      
      let closestTile = tiles[0];
      let closestDistance = Number.MAX_VALUE;
      
      tiles.forEach(tile => {
         const distance = Math.sqrt(
            Math.pow(tile.x - centerX, 2) + Math.pow(tile.y - centerY, 2)
         );
         if (distance < closestDistance) {
            closestDistance = distance;
            closestTile = tile;
         }
      });
      
      return closestTile;
   }

   public initCitiesListener(
      phaserTile: Phaser.Tilemaps.Tile, 
      mainScene: MainScene, 
      ourTile: Tile,
      cityGroup: CityGroup
   ): void {
      const cam = mainScene.cameras.main;
      const worldX = phaserTile.pixelX;
      const worldY = phaserTile.pixelY;
      const screenX = (worldX - cam.scrollX) * cam.zoom + cam.x;
      const screenY = (worldY - cam.scrollY) * cam.zoom + cam.y;

      // Create or get the cities container
      let parent: HTMLElement | null = document.querySelector(`#GameScene #tmp-cities`);
      if (!parent) {
         parent = document.createElement("div");
         parent.setAttribute('id', 'tmp-cities');
         parent.style.position = 'absolute';
         parent.style.top = '0';
         parent.style.left = '0';
         parent.style.pointerEvents = 'none';
         document.querySelector("#GameScene")?.appendChild(parent);
      }

      // Create the city button
      const button = document.createElement("button");
      button.innerText = "Gérer la cité";
      button.style.position = "absolute";
      button.style.left = `${screenX}px`;
      button.style.top = `${screenY}px`;
      button.style.transform = "translate(-50%, -100%)";
      button.style.zIndex = "10";
      button.style.padding = "5px 10px";
      button.style.pointerEvents = 'auto';
      button.style.backgroundColor = '#4CAF50';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';

      parent.appendChild(button);

      // Add click event listener
      button.addEventListener("click", () => {
         this.openCityPanel(phaserTile, ourTile, cityGroup);
         console.log(`Bouton cliqué pour la cité en (${phaserTile.x}, ${phaserTile.y}) - ${cityGroup.tiles.length} tiles`);
      });

      // Store the button reference
      const centerPosition = new Point(phaserTile.x, phaserTile.y);
      this.cityButtons.push({ 
         phaserTile, 
         button, 
         ourTile, 
         centerPosition 
      });
   }

   public updateCityButtons(mainScene: MainScene): void {
      const cam = mainScene.cameras.main;
      const canvasBounds = (mainScene.game.canvas as HTMLCanvasElement).getBoundingClientRect();

      this.cityButtons.forEach(({ phaserTile, button }) => {
         const worldX = phaserTile.pixelX;
         const worldY = phaserTile.pixelY;

         const inViewX = worldX - cam.worldView.x;
         const inViewY = worldY - cam.worldView.y;

         const zoomedX = inViewX * cam.zoom;
         const zoomedY = inViewY * cam.zoom;

         const screenX = canvasBounds.left + zoomedX;
         const screenY = canvasBounds.top + zoomedY;

         button.style.left = `${screenX}px`;
         button.style.top = `${screenY}px`;
         
         // Hide button if out of view
         const isVisible = screenX >= canvasBounds.left - 50 && 
                          screenX <= canvasBounds.right + 50 &&
                          screenY >= canvasBounds.top - 50 && 
                          screenY <= canvasBounds.bottom + 50;
         
         button.style.display = isVisible ? "block" : "none";
      });
   }

   private openCityPanel(tile: Phaser.Tilemaps.Tile, ourTile: Tile, cityGroup: CityGroup): void {
      const panel = document.getElementById("city-panel");
      const close = document.getElementById("city-panel-close");
      const title = document.getElementById("city-name");
      const content = document.getElementById("city-content");

      // Check if elements exist
      if (!panel || !close || !title || !content) {
         console.error("City panel elements not found in DOM");
         return;
      }

      // Request units data from server
      //HTML.socket?.emit("getUnits");

      const categories = ["melee", "ranged", "mounted"];
      
      // Set up listener for units data
      const unitsListHandler = (data: any) => {
         let unitsHTML = "<h3>Unités recrutable :</h3>";
      
         categories.forEach((category) => {
            const units = data.units?.[category];
            if (units && units.length > 0) {
               unitsHTML += `<h4>${category.toUpperCase()}</h4><ul>`;
               units.forEach((unit: any) => {
                  unitsHTML += `
                     <li>
                        <strong>${unit.name}</strong> (ID: ${unit.id})<br/>
                        PV: ${unit.stats.pv ?? unit.stats.health}<br/>
                        Attaque: ${unit.stats.attack}, Défense: ${unit.stats.defense}<br/>
                        Mouvement: ${unit.stats.movement}, Portée: ${unit.stats.range}<br/>
                        Coût: ${unit.cost.production} 🛠️
                     </li>
                  `;
               });
               unitsHTML += "</ul>";
            }
         });
      
         // Update DOM content
         title.innerText = `Cité (${tile.x},${tile.y}) - ${cityGroup.tiles.length} tiles`;
         content.innerHTML = `
            <p>Faction : ${ourTile._faction}</p>
            <p>Taille de la cité : ${cityGroup.tiles.length} tiles</p>
            <p>Position centrale : (${cityGroup.centerPosition.x}, ${cityGroup.centerPosition.y})</p>
            ${unitsHTML}
         `;

         // Remove the listener to avoid memory leaks
         //HTML.socket?.off("unitsList", unitsListHandler);
      };

      //HTML.socket?.on("unitsList", unitsListHandler);

      // Open the panel
      panel.classList.add("open");

      // Set up close functionality
      const onClose = () => {
         panel.classList.remove("open");
         close.removeEventListener("click", onClose);
         // Clean up socket listener if still active
         //HTML.socket?.off("unitsList", unitsListHandler);
      };
      
      close.addEventListener("click", onClose);
   }

   // Utility method to clean up city buttons
   public cleanupCityButtons(): void {
      this.cityButtons.forEach(({ button }) => {
         button.remove();
      });
      this.cityButtons = [];
      this.cityGroups = [];
      this.processedCityTiles.clear();
      
      const citiesContainer = document.querySelector('#GameScene #tmp-cities');
      if (citiesContainer) {
         citiesContainer.remove();
      }
   }
}

export function downloadJSON<T extends (string | number | boolean | Tile | T | any)[][]>(
   data: T, 
   filename: string = "tableau.json"
): void {
   const jsonString = JSON.stringify(data);
   const blob = new Blob([jsonString], { type: "application/json" });
   const url = URL.createObjectURL(blob);
   
   const a = document.createElement("a");
   a.href = url;
   a.download = filename;
   a.click();
 
   URL.revokeObjectURL(url);
}