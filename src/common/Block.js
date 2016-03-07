"use strict";

let Entity = require("./Entity");

module.exports = class Block extends Entity {
  
  constructor() {
    super();
    this.size = [ 16, 16 ];
    
    this.renderer = "sprite";
    this.sprite   = "block";
    
    this.solid    = true;
    this.collider = "box";
  }
  
};
