// Fichier crée pour y ajouter toutes les fonctions, qui ne pourrait trouver leurs place dans un seul fichier
// On évite de crée trop de fonctions dans le main hormis, ceux vraiment propre aux main, pour ne pas surcharger la page

export function round(value: number, fuzz: number) {
  return Math.round(value * fuzz) / fuzz;
}

export function bitOf(bit: number) {
  return Math.pow(2,bit);
}

export function bitEquals(flag: number, bit: number) {
  bit=bitOf(bit);
  return (flag&bit)==bit;
}

export function bitsIn(flag: number): number[] {
  let bit: number = 0;
  let bits: number[] = new Array<number>();
  while(!(bitOf(bit++)<flag)) {if (bitEquals(flag,bit)) {bits.push(bitOf(bit));}}
  return bits;
}