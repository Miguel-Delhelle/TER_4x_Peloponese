import { Tile } from "./Tile";
import { Point } from "../../Math/Point";
import { Terrain } from "./Terrain";
import { FACTION, parseEnum } from "../../Entity/EFaction";
import type { MainScene } from "../MainScene";
import { mainScene, socket } from "../../..";
import { Data } from "phaser";

interface CityUIButton {
   phaserTile: Phaser.Tilemaps.Tile;
   button: HTMLButtonElement;
   ourTile:Tile;
}


export class GreekMap{
   
   public map: Phaser.Tilemaps.Tilemap;
   public dynamicMatrice: Tile[][] = [];
   public staticMatrice: (Tile|null)[][] = [];
   public cityButtons: CityUIButton[] = [];


   //public dynamicMatrice: Tile[][]

   constructor(map:Phaser.Tilemaps.Tilemap){
      this.map = map;
      this.initStaticMatrice();
      this.initDynamicMatrice();
      downloadJSON(this.dynamicMatrice);
      //downloadJSON(this.staticMatrice,"startStaticMatrice.json");
      //this.initDynamicMatrice();
      //this.putDynamicToServ();

   }


   public initStaticMatrice():void{
      var terrains: Terrain[] = [];
      //var tilesTraite:Point[] = [];
      this.map.getLayer("Montains")?.tilemapLayer.forEachTile(tile => {
         const x: number = tile.x;
         const y: number = tile.y;
         if(tile.index === -1) {
            const tmp = this.map.getTileAt(x,y,false,"Hills");
            if(tmp) tile = tmp;
            else tile = this.map.getTileAt(x,y,false,"Landscape")!;
         }
        
         if(!this.staticMatrice[x]) this.staticMatrice[x] = [];

         let props:any = tile.tileset?.getTileProperties(tile.index);
         //console.log(props);
         let dataProps:any = tile.getTileData()!;
         //if(props) {
            let tileID:Point = new Point(tile.x, tile.y);
            const terrain: Terrain = new Terrain(
               props.IsBuildingEnabled ?? false,
               props.IsFarmingEnabled ?? false,
               props.IsWalkingEnabled ?? false,
               props.MovementCost ?? -1,
               dataProps.type ?? "error cc"
            )
            this.staticMatrice[x][y] = new Tile(tileID, terrain);  
         //}else this.staticMatrice[x][y] = null;
         //return null;
      });
   }

   public initDynamicMatrice():void{
      this.map.getLayer("Units")?.tilemapLayer.forEachTile(tile => {
         const x: number = tile.x;
         const y: number = tile.y;
         if(tile.index === -1) {
            const tmp = this.map.getTileAt(x,y,false,"Buildings");
            if(tmp) tile = tmp;
            else tile = this.map.getTileAt(x,y,false,"Road")!;
         }
        
         if(!this.dynamicMatrice[x]) this.dynamicMatrice[x] = [];
         let props:any;
         let dataProps:any;
         if (tile)
            {
               props = tile.tileset?.getTileProperties(tile.index);
               dataProps = tile.getTileData()!;
               console.log(props);
               console.log(dataProps);

            }
         //console.log(props);
         let faction:string;
         if(props) {
            let tileID:Point = new Point(tile.x, tile.y);
            const terrain: Terrain = new Terrain(
               props.IsBuildingEnabled ?? false,
               props.IsFarmingEnabled ?? false,
               props.IsWalkingEnabled ?? false,
               props.MovementCost ?? -1,
               dataProps.type ?? "error cc"
            )
            faction = props.Faction;
            //if (dataProps.faction === undefined){faction = "Wilderness"}
            //else{faction = parseEnum(FACTION,(dataProps.faction as string).toUpperCase() ?? FACTION.WILDERNESS)! }

            let tmpOurTile = new Tile(tileID, terrain, faction)
            this.dynamicMatrice[x][y] = tmpOurTile;
            if (dataProps.type === "Cities"){
               this.initCitiesListener(tile,mainScene,tmpOurTile);

               const radius = 30;
               const cx = tile.x;
               const cy = tile.y;            

               for (let dx = -radius; dx <= radius; dx++) {
                  for (let dy = -radius; dy <= radius; dy++) {
                     const nx = cx + dx;
                     const ny = cy + dy;
            
                     if (!this.dynamicMatrice[nx]) this.dynamicMatrice[nx] = [];
            
                     // Si la tuile existe déjà on la met à jour, sinon on en crée une nouvelle
                     const isInCircle = (dx*dx + dy*dy <= radius*radius); // cercle
                     if (isInCircle && this.staticMatrice[nx]?.[ny]) {
                        const terrain = this.staticMatrice[nx][ny]._terrain; // on copie le terrain static
                        const tileID = new Point(nx, ny);
                        const factionTile = new Tile(tileID, terrain, faction);
                        this.dynamicMatrice[nx][ny] = factionTile;
                     }
                  }
               }
            }
         }
      });
   }

   public initCitiesListener(phaserTile: Phaser.Tilemaps.Tile, mainScene: MainScene,ourTile:Tile): void {
      const cam = mainScene.cameras.main;

      const worldX = phaserTile.pixelX;
      const worldY = phaserTile.pixelY;

      const screenX = (worldX - cam.scrollX) * cam.zoom + cam.x;
      const screenY = (worldY - cam.scrollY) * cam.zoom + cam.y;

      const button = document.createElement("button");
      button.innerText = "Gérer la cité";
      button.style.position = "absolute";
      button.style.left = `${screenX}px`;
      button.style.top = `${screenY}px`;
      button.style.transform = "translate(-50%, -100%)";
      button.style.zIndex = "10";
      button.style.padding = "5px 10px";

      document.body.appendChild(button);

      button.addEventListener("click", () => {
         this.openCityPanel(phaserTile,ourTile);
         console.log(`Bouton cliqué pour la cité en (${phaserTile.x}, ${phaserTile.y})`);
      });

      this.cityButtons.push({ phaserTile, button,ourTile }); // 👈 On stocke
   }

   public updateCityButtons(mainScene: MainScene): void {
      const cam = mainScene.cameras.main;
      // Récupère la bounding box du canvas Phaser dans la page
      const canvasBounds = (mainScene.game.canvas as HTMLCanvasElement)
                              .getBoundingClientRect();

      this.cityButtons.forEach(({ phaserTile, button }) => {
         // Coordonnées monde (en pixels)
         const worldX = phaserTile.pixelX;
         const worldY = phaserTile.pixelY;

         // Coordonnées dans le viewport caméra (en pixels non-scalés)
         const inViewX = worldX - cam.worldView.x;
         const inViewY = worldY - cam.worldView.y;

         // Application du zoom
         const zoomedX = inViewX * cam.zoom;
         const zoomedY = inViewY * cam.zoom;

         // Passage aux coordonnées page
         const screenX = canvasBounds.left + zoomedX;
         const screenY = canvasBounds.top  + zoomedY;

         // Positionnement du bouton (centré au-dessus)
         button.style.left = `${screenX}px`;
         button.style.top  = `${screenY}px`;
      });
   }


   private openCityPanel(tile: Phaser.Tilemaps.Tile, ourTile:Tile) {
      const panel = document.getElementById("city-panel")!;
      const close = document.getElementById("city-panel-close")!;
      const title = document.getElementById("city-name")!;
      const content = document.getElementById("city-content")!;

      socket!.emit("getUnits");

      const categories = ["melee", "ranged", "mounted"];
      
      socket.on("unitsList", (data: any) => {
        let unitsHTML = "<h3>Unités recrutable :</h3>";
      
        categories.forEach((category) => {
          const units = data.units[category];
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
      
        // ✅ Mise à jour du DOM au bon moment, quand unitsHTML est prêt
        title.innerText = `Cité (${tile.x},${tile.y})`;
        content.innerHTML = `
          <p>Faction : ${ourTile._faction}</p>
          ${unitsHTML}`;
      });
      

      // 2) Ouvre le panneau
      panel.classList.add("open");

      // 3) Fermer au besoin
      const onClose = () => {
         panel.classList.remove("open");
         close.removeEventListener("click", onClose);
      };
      close.addEventListener("click", onClose);
      }





   /*putDynamicToServ(){
      // TO DO FAIRE UN SI LA MAP EST DEJA ENVOYE NE PAS LA RENVOYEZ... Oui psk, on est plusieurs par room, faut envoyez une map de la room
      //socket.emit("sendMatriceMap",{dynamicMatrice:this.dynamicMatrice, staticMatrice:this.staticMatrice});
      
      //socket.emit("sendStaticMap",this.staticMatrice);

   } */
}



export function downloadJSON<T extends (string | number | boolean | Tile | T | any)[][]>(data: T, filename: string = "tableau.json") {
   const jsonString = JSON.stringify(data,null,2);
   const blob = new Blob([jsonString], { type: "application/json" });
   const url = URL.createObjectURL(blob);
   
   const a = document.createElement("a");
   a.href = url;
   a.download = filename;
   a.click();
 
   URL.revokeObjectURL(url);
 }
 