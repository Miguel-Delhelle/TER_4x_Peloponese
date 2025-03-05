export class test {


  private id:string = "0.0"; // from x/y
  private x:number = 0;
  private y:number = 0;
  private centerPt:[number,number];

  
  // A factoriser -- class TilePolygone

  private path:string; // from polygonPts
  private polygonPts:Array<[number,number]> = new Array<[number,number]>();
  private innerCircleRadius:number;
  private outerCircleRadius:number = 0;
  private nbVertex:number; // from
  private angleBetweenAxe:number;

  // A factoriser -- class TileD3
  private htmlOwner: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private htmlGroup: d3.Selection<SVGGElement, unknown, HTMLElement, undefined>;
  private htmlPath!: d3.Selection<SVGPolygonElement, unknown, HTMLElement, undefined>;
  private colorCss : string = "aqua";


  private domElement: HTMLElement;

  /*
  private terrain_type:TerrainType;
  */

  public constructor(svg:d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
      row:number,
      col:number, 
      centerPt:[number,number],
      innerCircleRadius:number,
      nbVertex:number){

      this.y = row;
      this.x = col;
      this.id = this.initID();
      this.centerPt = centerPt;
      this.innerCircleRadius = innerCircleRadius;
      this.nbVertex = nbVertex;
      this.angleBetweenAxe = this.initAngleBetweenAxe();
      this.generatePtsFromInnerCircle();
      this.htmlOwner = svg;
      this.htmlGroup = this.createGroup();
      this.path = this.generatePathFromPts();
      this.appendTileOn();
      this.initListener();
      this.domElement = this.getDocument();
  }


  public get _id() : string {return this.id;}
  public get _x() : number {return this.x;}
  public get _y() : number {return this.y;}
  public get _path() : string {return this.path;}
  public get _polygonPts() : Array<[number,number]> {return this.polygonPts;}
  public get _centerPt() : [number,number] {return this.centerPt;}
  public get _innerCircleRadius() : number {return this.innerCircleRadius;}
  public get _outerCircleRadius() : number {return this.outerCircleRadius;}
  public get _nbVertex() : number {return this.nbVertex;}
  public get _angleBetweenAxe() : number {return this.angleBetweenAxe;}


  private initAngleBetweenAxe():number {
      return 2*Math.PI / this.nbVertex ;
  }

  private initID():string {
      return `${this.x}.${this.y}`;
  }

  private initOuterCircleRadius(angleMidAxe:number) {
      return this.innerCircleRadius / Math.cos(angleMidAxe);
  }

  private generatePathFromPts():string {
      if (this.polygonPts.length>0) {
          let str:string = "";
          for (let pt of this.polygonPts) {
          str += pt[0]+","+pt[1]+" " ;
          }
          return str+"";
      } else {
          return "";
      }
  }

  private createGroup():d3.Selection<SVGGElement, unknown, HTMLElement, undefined> {
      return this.htmlOwner.append("g")
          .attr("class", "map tile")
          .attr("id", this._id);
  }
/*
  private addHTMLElement(
      parent:any,
      element:string,
      attr:{[key:string]:string},
      style:{[key:string]:string},
      text:{[key:string]:string}):void {
      let child:any = parent.append(element);
      if (attr) {child.attr(attr);}
      if (style.length>0) {child.style(style);}
      if (text.length>0) {child.text(text);}
  }
*/
  private generatePtsFromInnerCircle():void {
    const angleMidAxe: number = this.angleBetweenAxe / 2. ;
    const angleStart: number = angleMidAxe + Math.PI/2 ;
    this.outerCircleRadius = this.initOuterCircleRadius(angleMidAxe) ;
    for (let i=0 ; i<this.nbVertex ; i++) {
      this.polygonPts[i] = commonGeo.polar(this.centerPt, i*this.angleBetweenAxe+angleStart, this.outerCircleRadius) ;
    }
  }

  public appendTileOn(){
      //this.addHTMLElement(this.htmlGroup,"path",)
      this.htmlPath = this.htmlGroup.append("polygon")
          .attr("class", "map path")
          .attr("points", this._path)
          .attr("fill", "grey")
          .attr("stroke", "black")
          .attr("stroke-width","1");
      this.htmlGroup.append("text")
          .attr("x",this._centerPt[0])
          .attr("y",this._centerPt[1])
          .style("font","5px times")
          .style("text-anchor","middle")
          .text(this._x+"."+this._y);
  }

  public getDocument():HTMLElement{

      return document.getElementById(this._id)!;
  }

  private initListener(){
      this.getDocument().addEventListener("click", e => {
          
          console.log("j'ai cliqué sur ma Tile "+this._id+" youhou");
      }
      )
  }

  public addElement(){

  }
}