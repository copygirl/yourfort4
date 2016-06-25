"use strict";

module.exports = class Entity {
  
  constructor() {
    this.main = null;
    this.id   = null;
    
    //  Added by Physics
    // pos      = [ 0, 0 ]
    // size     = [ 0, 0 ]
    // speed    = [ 0, 0 ]
    // acc      = [ 0, 240 ]
    // physics  = false : If true, applies speed and gravity to entity.
    // collider = null  : Required for collision. May be set to "box" or null.
    
    //  Added by Graphics
    // renderer = null : May be set to "sprite".
    // sprite   = null : Required for sprite renderer.
    // color    = [ 1, 1, 1, 1 ]
  }
  
  get spawned() { return (this.id != null); }
  
  // Update function. Registered when entity
  // is spawned, then called every tick.
  // update() { ... }
  
  toString() { return "[" + this.constructor.name + ((this.spawned) ? " (" + this.id + ")" : "") + "]"; }
  
};
