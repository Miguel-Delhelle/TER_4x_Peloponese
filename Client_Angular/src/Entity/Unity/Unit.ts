import { Entity } from "./Entity";

export class Unit extends Entity {
    private nomUnite:string;

    constructor(){
        super("E1");
        this.nomUnite = "NOM_DE_MON_UNITE";
    }

    getNomUnite(){
        return this.nomUnite;
    }

}