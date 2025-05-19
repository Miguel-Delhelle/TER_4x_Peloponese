import { Tile } from "./Tile";
import { Point } from "../../Math/Point";
import { Terrain } from "./Terrain";
import { FACTION, parseEnum } from "../../Entity/EFaction";
import type { MainScene } from "../MainScene";
import { mainScene, socket } from "../../..";
import { Unit } from "../../Entity/Unit";
import { Melee } from "../../Entity/Melee";

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
      this.downloadJSON(this.dynamicMatrice);
   }

   public initStaticMatrice(): void {
      const mountainLayer = this.map.getLayer(this.LAYERS.MOUNTAINS)?.tilemapLayer;
      
      if (!mountainLayer) {
         console.warn("Couche Mountains non trouvée");
         return;
      }

      mountainLayer.forEachTile(tile => {
         const { x, y } = tile;
         let activeTile = tile;
         
         // Logique originale : si la tuile est vide (-1), chercher dans les couches inférieures
         if (tile.index === -1) {
            const hillsTile = this.map.getTileAt(x, y, false, this.LAYERS.HILLS);
            if (hillsTile) {
               activeTile = hillsTile;
            } else {
               const landscapeTile = this.map.getTileAt(x, y, false, this.LAYERS.LANDSCAPE);
               if (landscapeTile) {
                  activeTile = landscapeTile;
               }
            }
         }

         this.ensureMatrixColumn(this.staticMatrice, x);
         
         const tileProperties = this.extractTileProperties(activeTile);
         const terrain = this.createTerrain(tileProperties);
         
         this.staticMatrice[x][y] = new Tile(new Point(x, y), terrain);
      });
   }

   public initDynamicMatrice(): void {
      const unitsLayer = this.map.getLayer(this.LAYERS.UNITS)?.tilemapLayer;
      
      if (!unitsLayer) {
         console.warn("Couche Units non trouvée");
         return;
      }

      // Première passe : traiter toutes les tuiles avec la logique originale
      const cityTiles: Phaser.Tilemaps.Tile[] = [];

      unitsLayer.forEachTile(tile => {
         const { x, y } = tile;
         let activeTile = tile;
         
         // Logique originale : si la tuile est vide (-1), chercher dans les couches inférieures
         if (tile.index === -1) {
            const buildingsTile = this.map.getTileAt(x, y, false, this.LAYERS.BUILDINGS);
            if (buildingsTile) {
               activeTile = buildingsTile;
            } else {
               const roadTile = this.map.getTileAt(x, y, false, this.LAYERS.ROAD);
               if (roadTile) {
                  activeTile = roadTile;
               }
            }
         }

         this.ensureMatrixColumn(this.dynamicMatrice, x);

         const tileProperties = this.extractTileProperties(activeTile);
         const terrain = this.createTerrain(tileProperties);
         const faction = tileProperties.faction || "Wilderness";

         const ourTile = new Tile(new Point(x, y), terrain, faction);
         this.dynamicMatrice[x][y] = ourTile;

         // Collecter les tuiles de cités pour traitement ultérieur
         const tileData:any = activeTile.getTileData();
         if (tileData?.type === "Cities") {
            cityTiles.push(activeTile);
         }
      });

      // Deuxième passe : identifier les groupes de cités et créer boutons
      this.processCityGroups(cityTiles);
   }

   private processCityGroups(cityTiles: Phaser.Tilemaps.Tile[]): void {
      const processedTiles = new Set<string>();
      
      cityTiles.forEach(tile => {
         const key = `${tile.x},${tile.y}`;
         if (processedTiles.has(key)) return;

         // Trouve toutes les tuiles de cité adjacentes à cette tuile
         const cityGroup = this.findAdjacentCityTiles(tile, cityTiles, processedTiles);
         
         if (cityGroup.length > 0) {
            const centerTile = this.findCenterTile(cityGroup);
            const centerPosition = new Point(centerTile.x, centerTile.y);
            const tileProperties = this.extractTileProperties(centerTile);
            const faction = tileProperties.faction || "Wilderness";
            
            // Appliquer l'influence de la cité depuis le centre
            this.applyCityInfluence(centerPosition._x, centerPosition._y, faction);
            
            // Créer le bouton pour ce groupe de cités
            const ourTile = this.dynamicMatrice[centerPosition._x]?.[centerPosition._y];
            if (ourTile) {
               this.initCityListener(centerTile, mainScene, ourTile);
            }

            // Marquer toutes les tuiles de ce groupe comme traitées
            cityGroup.forEach(cityTile => {
               processedTiles.add(`${cityTile.x},${cityTile.y}`);
            });
         }
      });
   }

   private findAdjacentCityTiles(
      startTile: Phaser.Tilemaps.Tile, 
      allCityTiles: Phaser.Tilemaps.Tile[],
      processedTiles: Set<string>
   ): Phaser.Tilemaps.Tile[] {
      const cityGroup: Phaser.Tilemaps.Tile[] = [startTile];
      const toProcess: Phaser.Tilemaps.Tile[] = [startTile];
      const visited = new Set<string>();
      visited.add(`${startTile.x},${startTile.y}`);

      while (toProcess.length > 0) {
         const currentTile = toProcess.pop()!;
         
         // Vérifier les 8 directions adjacentes
         const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
         ];

         for (const [dx, dy] of directions) {
            const nx = currentTile.x + dx;
            const ny = currentTile.y + dy;
            const key = `${nx},${ny}`;

            if (visited.has(key)) continue;

            // Chercher dans la liste des tuiles de cités
            const adjacentCityTile = allCityTiles.find(tile => tile.x === nx && tile.y === ny);
            
            if (adjacentCityTile) {
               visited.add(key);
               cityGroup.push(adjacentCityTile);
               toProcess.push(adjacentCityTile);
            }
         }
      }

      return cityGroup;
   }

   private findCenterTile(cityTiles: Phaser.Tilemaps.Tile[]): Phaser.Tilemaps.Tile {
      // Calcule le centre géométrique des tuiles de la cité
      const avgX = cityTiles.reduce((sum, tile) => sum + tile.x, 0) / cityTiles.length;
      const avgY = cityTiles.reduce((sum, tile) => sum + tile.y, 0) / cityTiles.length;

      // Trouve la tuile la plus proche du centre
      return cityTiles.reduce((closest, tile) => {
         const distCurrent = Math.abs(tile.x - avgX) + Math.abs(tile.y - avgY);
         const distClosest = Math.abs(closest.x - avgX) + Math.abs(closest.y - avgY);
         return distCurrent < distClosest ? tile : closest;
      });
   }

   // Méthode supprimée car logique intégrée directement dans les méthodes principales

   // Ancienne méthode getActiveTile supprimée - logique intégrée directement

   private extractTileProperties(tile: Phaser.Tilemaps.Tile): any {
      const props:any = tile.tileset?.getTileProperties(tile.index) || {};
      const dataProps:any = tile.getTileData() || {};
      
      return {
         ...props,
         ...dataProps,
         faction: props.Faction || dataProps.faction
      };
   }

   private createTerrain(properties: any): Terrain {
      return new Terrain(
         properties.IsBuildingEnabled ?? false,
         properties.IsFarmingEnabled ?? false,
         properties.IsWalkingEnabled ?? false,
         properties.MovementCost ?? -1,
         properties.type ?? "unknown"
      );
   }

   private ensureMatrixColumn<T>(matrix: T[][], x: number): void {
      if (!matrix[x]) matrix[x] = [];
   }

   private applyCityInfluence(centerX: number, centerY: number, faction: string): void {
      for (let dx = -this.CITY_INFLUENCE_RADIUS; dx <= this.CITY_INFLUENCE_RADIUS; dx++) {
         for (let dy = -this.CITY_INFLUENCE_RADIUS; dy <= this.CITY_INFLUENCE_RADIUS; dy++) {
            const nx = centerX + dx;
            const ny = centerY + dy;

            this.ensureMatrixColumn(this.dynamicMatrice, nx);

            const isInCircle = (dx * dx + dy * dy <= this.CITY_INFLUENCE_RADIUS * this.CITY_INFLUENCE_RADIUS);
            const staticTile = this.staticMatrice[nx]?.[ny];
            
            if (isInCircle && staticTile) {
               const terrain = staticTile._terrain;
               const tileID = new Point(nx, ny);
               this.dynamicMatrice[nx][ny] = new Tile(tileID, terrain, faction);
            }
         }
      }
   }

   // Méthode supprimée car intégrée dans processCityGroups

   public initCityListener(phaserTile: Phaser.Tilemaps.Tile, mainScene: MainScene, ourTile: Tile): void {
      const button = this.createCityButton(phaserTile, mainScene);
      
      button.addEventListener("click", () => {
         this.openCityPanel(phaserTile, ourTile);
         console.log(`Cité gérée à (${phaserTile.x}, ${phaserTile.y})`);
      });

      this.cityButtons.push({ 
         phaserTile, 
         button, 
         ourTile, 
         centerPosition: new Point(phaserTile.x, phaserTile.y) 
      });
   }

   private createCityButton(phaserTile: Phaser.Tilemaps.Tile, mainScene: MainScene): HTMLButtonElement {
      const cam = mainScene.cameras.main;
      const worldX = phaserTile.pixelX;
      const worldY = phaserTile.pixelY;
      const screenX = (worldX - cam.scrollX) * cam.zoom + cam.x;
      const screenY = (worldY - cam.scrollY) * cam.zoom + cam.y;

      const button = document.createElement("button");
      button.innerText = "Gérer la cité";
      button.className = "city-button";
      
      Object.assign(button.style, {
         position: "absolute",
         left: `${screenX}px`,
         top: `${screenY}px`,
         transform: "translate(-50%, -100%)",
         zIndex: "10",
         padding: "5px 10px",
         backgroundColor: "#4a90e2",
         color: "white",
         border: "none",
         borderRadius: "4px",
         cursor: "pointer",
         fontSize: "12px"
      });

      document.body.appendChild(button);
      return button;
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
         
         // Cacher le bouton si hors de vue
         const isVisible = screenX >= canvasBounds.left - 50 && 
                          screenX <= canvasBounds.right + 50 &&
                          screenY >= canvasBounds.top - 50 && 
                          screenY <= canvasBounds.bottom + 50;
         
         button.style.display = isVisible ? "block" : "none";
      });
   }

   private openCityPanel(tile: Phaser.Tilemaps.Tile, ourTile: Tile): void {
      const panel = document.getElementById("city-panel");
      const close = document.getElementById("city-panel-close");
      const title = document.getElementById("city-name");
      const content = document.getElementById("city-content");

      if (!panel || !close || !title || !content) {
         console.error("Éléments du panneau de cité non trouvés");
         return;
      }

      socket?.emit("getUnits");

      const handleUnitsData = (data: any) => {
         const unitsHTML = this.generateUnitsHTML(data);
         
         title.innerText = `Cité (${tile.x},${tile.y})`;
         content.innerHTML = `
            <p>Faction : ${ourTile._faction}</p>
            ${unitsHTML}
         `;

         // Nettoyer l'ancien listener
         socket?.off("unitsList", handleUnitsData);
      };

      socket?.on("unitsList", handleUnitsData);

      panel.classList.add("open");

      const onClose = () => {
         panel.classList.remove("open");
         close.removeEventListener("click", onClose);
         socket?.off("unitsList", handleUnitsData);
      };

      close.addEventListener("click", onClose);
   }

   private generateUnitsHTML(data: any): string {
      const categories = ["melee", "ranged", "mounted"];
      let unitsHTML = "<h3>Unités recrutables :</h3>";

      categories.forEach((category) => {
         const units = data.units[category];
         if (units && units.length > 0) {
            unitsHTML += `<h4>${category.toUpperCase()}</h4><ul>`;
            
            units.forEach((unit: any) => {
               unitsHTML += `
                  <li class="unit-item" data-unit-id="${unit.id}" data-category="${category}">
                     <strong>${unit.name}</strong><br/>
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

      // Ajouter les listeners après génération du HTML
      setTimeout(() => this.addUnitListeners(), 0);

      return unitsHTML;
   }

   private addUnitListeners(): void {
      const unitItems = document.querySelectorAll(".unit-item");
      
      unitItems.forEach(item => {
         item.addEventListener("click", () => {
            const unitId = item.getAttribute("data-unit-id");
            const category = item.getAttribute("data-category");
            
            this.recruitUnit(unitId, category);
         });
      });
   }

   private recruitUnit(unitId: string | null, category: string | null): void {
      if (!unitId || !category) return;

      console.log(`Recrutement d'unité: ${unitId} de catégorie ${category}`);
      
      // TODO: Implémenter la logique de recrutement
      switch (category) {
         case "melee":
            // const unit = new Melee();
            break;
         case "ranged":
            // const unit = new Range();
            break;
         case "mounted":
            // const unit = new Mounted();
            break;
      }
   }

   public destroyCityButtons(): void {
      this.cityButtons.forEach(({ button }) => {
         button.remove();
      });
      this.cityButtons = [];
   }

   public downloadJSON<T extends any[][]>(data: T, filename: string = "tableau.json"): void {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
   }
}