import type { Direction } from './types/Unit';


// dans mes test avec l'ia j'ai eu ça qui a été généré je suis vraiment pas sûr que ce soit qualitatif sachant que j'ai supprimer tout le reste mais
// si ça peut te donner un exemple de code luna prend.

export type AnimationState = 'Iddle' | 'Walk' | 'Attack' | 'Block' | 'Run';

export interface AnimationFrame {
    startFrame: number;
    endFrame: number;
    path: string;
}

export interface UnitAnimation {
    [key: string]: {
        [key in Direction]?: AnimationFrame;
    };
}

export class AnimationManager {
    private animations: Map<string, UnitAnimation>;
    private currentFrame: number;
    private currentAnimation: string;
    private currentDirection: Direction;
    private frameCount: number;
    private frameDelay: number;
    private lastFrameTime: number;

    constructor() {
        this.animations = new Map();
        this.currentFrame = 0;
        this.currentAnimation = 'Iddle';
        this.currentDirection = 'S';
        this.frameCount = 0;
        this.frameDelay = 100; // Délai entre les frames en ms
        this.lastFrameTime = 0;
    }

    public loadAnimations(faction: string, unitType: string, unitClass: string): void {
        const basePath = `/mapTiled/Tileset/${faction}/Units/Soldiers/${unitClass}`;
        const animations: UnitAnimation = {
            Iddle: {},
            Walk: {},
            Attack: {},
            Block: {},
            Run: {}
        };

        // Charger les animations pour chaque direction
        ['E', 'N', 'S', 'W'].forEach((direction) => {
            const states: AnimationState[] = ['Iddle', 'Walk', 'Attack', 'Block', 'Run'];
            states.forEach((state) => {
                const pattern = `A_${unitType}_${state}-${direction}_`;
                // Les frames sont généralement dans le format XX-XX
                const framePattern = /(\d+)-(\d+)/;
                const match = pattern.match(framePattern);
                if (match) {
                    animations[state][direction as Direction] = {
                        startFrame: parseInt(match[1]),
                        endFrame: parseInt(match[2]),
                        path: `${basePath}/A_${unitType}_${state}-${direction}_${match[1]}-${match[2]}.png`
                    };
                }
            });
        });

        this.animations.set(`${faction}_${unitType}`, animations);
    }

    public setAnimation(unitId: string, state: AnimationState, direction: Direction): void {
        const unitAnimations = this.animations.get(unitId);
        if (!unitAnimations || !unitAnimations[state] || !unitAnimations[state][direction]) {
            console.warn(`Animation non trouvée pour ${unitId} - ${state} - ${direction}`);
            return;
        }

        this.currentAnimation = state;
        this.currentDirection = direction;
        const animation = unitAnimations[state][direction]!;
        this.currentFrame = animation.startFrame;
        this.frameCount = animation.endFrame - animation.startFrame + 1;
    }

    public update(currentTime: number): string | null {
        if (currentTime - this.lastFrameTime < this.frameDelay) {
            return null;
        }

        const unitAnimations = this.animations.get(this.currentAnimation);
        if (!unitAnimations) return null;

        const animation = unitAnimations[this.currentAnimation][this.currentDirection];
        if (!animation) return null;

        this.currentFrame++;
        if (this.currentFrame > animation.endFrame) {
            this.currentFrame = animation.startFrame;
        }

        this.lastFrameTime = currentTime;
        return animation.path;
    }

    public getCurrentAnimation(): string {
        return this.currentAnimation;
    }

    public getCurrentDirection(): Direction {
        return this.currentDirection;
    }
} 