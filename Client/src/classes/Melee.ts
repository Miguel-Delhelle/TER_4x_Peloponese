import type { Direction, UnitPosition, UnitStats } from '../types/Unit';
import { Unit } from './Unit';

export class Melee extends Unit {
    constructor(id: string, faction: string, type: string, stats: UnitStats, position: UnitPosition) {
        super(id, faction, type, stats, position);
    }

    protected getUnitClass(): string {
        return 'Melee';
    }

    public attack(target: Unit): void {
        super.attack(target);
        // Logique d'attaque spécifique aux unités de mêlée
        const damage = Math.max(0, this.stats.attack - target.getStats().defense);
        target.takeDamage(damage);
    }
} 