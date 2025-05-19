import Phaser from 'phaser';

// === Types ===
interface Joueur {
  id: number;
  nom: string;
  ressources: {
    metal: number;
    food: number;
    wood: number;
    population: number;
    gold: number;
  };
}

interface Unite {
  id: number;
  joueurId: number;
  x: number;
  y: number;
}

// === Données globales ===
const joueurs: Joueur[] = [
  {
    id: 1,
    nom: 'Athènes',
    ressources: { metal: 100, food: 100, wood: 100, population: 100, gold: 100 }
  },
  {
    id: 2,
    nom: 'Sparte',
    ressources: { metal: 100, food: 100, wood: 100, population: 100, gold: 100 }
  },
  {
    id: 3,
    nom: 'Thèbes',
    ressources: { metal: 100, food: 100, wood: 100, population: 100, gold: 100 }
  }
];

const unites: Unite[] = [];

const tileOwners: number[] = []; // Propriétaire de chaque tuile
const stationnement: Record<string, { joueurId: number; temps: number }> = {}; // Temps sur chaque case

export class MainScene extends Phaser.Scene {
  map!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super('mainScene');
  }

  preload(): void {
    this.load.tilemapTiledJSON('map', 'mapTiled/Maps/AncientGreece.json');
    this.load.image('tiles', 'mapTiled/Tileset/tileset.png'); // adapte le nom si besoin
  }

  create(): void {
    this.map = this.make.tilemap({ key: 'map' });
    const tileset = this.map.addTilesetImage('tilesetName', 'tiles');
    const buildingsLayer = this.map.createLayer('Buildings', tileset);

    const width = this.map.width;
    const height = this.map.height;

    // Initialisation des propriétaires
    for (let i = 0; i < width * height; i++) {
      tileOwners[i] = null;
    }

    // === Ajout d’unités de test ===
    unites.push({ id: 1, joueurId: 1, x: 10, y: 12 }); // Athènes
    unites.push({ id: 2, joueurId: 2, x: 20, y: 5 });  // Sparte
    unites.push({ id: 3, joueurId: 3, x: 15, y: 8 });  // Thèbes

    // === Capture automatique des tuiles ===
    this.time.addEvent({
      delay: 1000, // chaque seconde
      loop: true,
      callback: () => {
        for (const unite of unites) {
          const key = `${unite.x},${unite.y}`;
          const tileIndex = unite.y * width + unite.x;
          const tile = buildingsLayer.getTileAt(unite.x, unite.y);

          if (tile && tile.index !== -1) {
            const current = stationnement[key];

            if (current && current.joueurId === unite.joueurId) {
              current.temps += 1;

              if (current.temps >= 60) {
                tileOwners[tileIndex] = unite.joueurId;
                console.log(
                  `✅ Joueur ${unite.joueurId} capture (${unite.x},${unite.y})`
                );
                delete stationnement[key];
              }
            } else {
              stationnement[key] = { joueurId: unite.joueurId, temps: 1 };
            }
          }
        }
      }
    });

    // === Production automatique ===
    this.time.addEvent({
      delay: 60_000,
      loop: true,
      callback: () => {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const tileIndex = y * width + x;
            const tile = buildingsLayer.getTileAt(x, y);

            if (tile && tile.index !== -1) {
              const ownerId = tileOwners[tileIndex];
              const joueur = joueurs.find(j => j.id === ownerId);

              if (joueur) {
                joueur.ressources.metal += 10;
                joueur.ressources.food += 10;
                joueur.ressources.wood += 10;
                joueur.ressources.population += 10;
                joueur.ressources.gold += 10;
              }
            }
          }
        }

        console.log("🪙 Production terminée.");
        console.table(joueurs.map(j => ({
          nom: j.nom,
          ...j.ressources
        })));
      }
    });
  }

  update(): void {
    // Futur : logique de déplacement d’unité, animation, etc.
  }
}
