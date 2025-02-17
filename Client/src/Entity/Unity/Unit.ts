import { Entity } from "./Entity";

export class Unit extends Entity {
    
    private nomUnite:string;

    constructor(nomUnite:string){
        super(nomUnite);
        this.nomUnite = nomUnite;
        this.editHtml();
    }

    public getNomUnite(){
        return this.nomUnite;
    }

    private editHtml():HTMLElement{
        let element:HTMLElement = super.getElementHtml();
        element.style.visibility = "visible" ;
        element.textContent = this.nomUnite;
    
        return element;
      }
    
}