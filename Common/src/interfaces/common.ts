export interface ClassManipulation {
  toString(): string;
  toJSON?(includePrivate?: boolean): Object;
}

export interface Comparable<T> {
  equals(that: T): boolean;
  compareTo?(that: T): number;
}