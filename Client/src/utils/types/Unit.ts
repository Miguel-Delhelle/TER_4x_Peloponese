export type Direction = 'E' | 'N' | 'S' | 'W';

export interface UnitStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    range: number;
}

export interface UnitPosition {
    x: number;
    y: number;
    direction: Direction;
}

export interface UnitState {
    isMoving: boolean;
    isAttacking: boolean;
    isBlocking: boolean;
    currentHealth: number;
} 