import { Entity } from "./Entity";

export class Unit extends Entity {
    
    private nomUnite:string;

    constructor(){
        super("1");
        this.nomUnite = "NOM_DE_MON_UNITE";
        this.editHtml();
    }

    getNomUnite(){
        return this.nomUnite;
    }

    private editHtml():HTMLElement{
        let element:HTMLElement = super.getElementHtml();
        element.style.visibility = "visible" ;
        element.textContent = this.nomUnite;
    
        return element;
      }
    
}