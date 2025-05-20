export type Factions = "ATHENS"|"SPARTA"|"THEBES"|"OTHERS"|"WILDERNESS";

export type AssetsCategories =
  "BUILDINGS"|
  "SHIPS"|
  "SOLDIERS"|
  "WORKERS"|

  "ANIMALS"|
  "NATURE"|
  "MISCELLANEOUS";

export type BuildingsCategories =
  "CITIES"|
  "RECRUITMENT"|
  "RESSOURCES"|
  "HOUSES"|
  "ENTERTAINMENT";
export type UnitsCategories =
  "MELEE"|
  "MOUNTED"|
  "RANGED"|
  "WORKERS";
export type ShipsCategories =
  "TRANSPORT"|
  "MILITARY";

export type AnimalsCategories =
  "WILD"|
  "TAMED";

export type AllSubCategories =
  BuildingsCategories|
  UnitsCategories|
  ShipsCategories|
  AnimalsCategories;