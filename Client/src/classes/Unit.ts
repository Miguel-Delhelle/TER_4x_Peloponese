import type { Direction, UnitPosition, UnitState, UnitStats } from '../types/Unit';
import { AnimationManager } from '../utils/AnimationManager';
import type { AnimationState } from '../utils/AnimationManager';

export abstract class Unit {
    protected id: string;
    protected faction: string;
    protected type: string;
    protected stats: UnitStats;
    protected position: UnitPosition;
    protected state: UnitState;
    protected animationManager: AnimationManager;

    constructor(id: string, faction: string, type: string, stats: UnitStats, position: UnitPosition) {
        this.id = id;
        this.faction = faction;
        this.type = type;
        this.stats = stats;
        this.position = position;
        this.state = {
            isMoving: false,
            isAttacking: false,
            isBlocking: false,
            currentHealth: stats.health
        };
        this.animationManager = new AnimationManager();
        this.animationManager.loadAnimations(faction, type, this.getUnitClass());
    }

    protected abstract getUnitClass(): string;

    public update(currentTime: number): void {
        // Mettre à jour l'animation en fonction de l'état
        let animationState: AnimationState = 'Iddle';
        if (this.state.isAttacking) {
            animationState = 'Attack';
        } else if (this.state.isBlocking) {
            animationState = 'Block';
        } else if (this.state.isMoving) {
            animationState = 'Walk';
        }

        this.animationManager.setAnimation(`${this.faction}_${this.type}`, animationState, this.position.direction);
        const currentSprite = this.animationManager.update(currentTime);
        if (currentSprite) {
            // Ici, vous pouvez mettre à jour le sprite de l'unité
            // Par exemple, en utilisant un moteur de rendu ou en mettant à jour un élément DOM
        }
    }

    public move(direction: Direction): void {
        this.position.direction = direction;
        this.state.isMoving = true;
        // Logique de déplacement à implémenter
    }

    public stop(): void {
        this.state.isMoving = false;
    }

    public attack(target: Unit): void {
        this.state.isAttacking = true;
        // Logique d'attaque à implémenter
    }

    public block(): void {
        this.state.isBlocking = true;
        // Logique de blocage à implémenter
    }

    public stopBlocking(): void {
        this.state.isBlocking = false;
    }

    public takeDamage(amount: number): void {
        this.state.currentHealth = Math.max(0, this.state.currentHealth - amount);
    }

    public heal(amount: number): void {
        this.state.currentHealth = Math.min(this.stats.health, this.state.currentHealth + amount);
    }

    public isDead(): boolean {
        return this.state.currentHealth <= 0;
    }

    // Getters
    public getId(): string {
        return this.id;
    }

    public getFaction(): string {
        return this.faction;
    }

    public getType(): string {
        return this.type;
    }

    public getStats(): UnitStats {
        return this.stats;
    }

    public getPosition(): UnitPosition {
        return this.position;
    }

    public getState(): UnitState {
        return this.state;
    }
} 