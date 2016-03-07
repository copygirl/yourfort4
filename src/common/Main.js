"use strict";

let { EventEmitter } = require("events");
let { Physics }      = require("./physics");
let { implement }    = require("./utility");

module.exports = implement(class Main {
  
  constructor(side) {
    EventEmitter.call(this);
    this.side = side;
    
    this.entities = new Map();
    this.updating = new Set();
    this.nextEntityId = 1;
    
    this.physics = new Physics(this);
  }
  
  add(entity) {
    if (entity.spawned)
      throw new Error(`Entity ${ entity } already spawned`);
    
    entity.main = this;
    entity.id = this.nextEntityId++;
    
    this.entities.set(entity.id, entity);
    if (entity.update != null)
      this.updating.add(entity);
    
    this.emit("spawn", entity);
  }
  
  remove(entity) {
    if (entity.main != this)
      throw new Error(`Entity ${ entity } not spawned`);
    
    this.entities.delete(entity.id);
    if (entity.update != null) this.updating.delete(entity);
    entity.main = entity.id = null;
    
    this.emit("despawn", entity);
  }
  
  update(delta) {
    for (let entity of this.updating)
      entity.update(delta);
    this.physics.update(delta);
  }
  
}, EventEmitter);
