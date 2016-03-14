"use strict";

let colliders = new Map();

module.exports = class Collider {
  
  get boundingBox() { throw new Error("Not implemented"); }
  
  // Update the collider to align with the specified entity.
  update(entity) { throw new Error("Not implemented"); }
  
  // Cast a ray from starting point p into direction d against this Collider.
  // Returns [ hit, normal ] or null if not hit.
  ray(p, d) { throw new Error("Not implemented"); }
  
  // Returns a new Collider made up of of this Collider, expanded by the specified Collider.
  expand(collider) { throw new Error("Not implemented"); }
  
  clone() { throw new Error("Not implemented"); }
  
  
  static add(colliderClass) {
    colliders.set(colliderClass.name.toLowerCase(), colliderClass);
  }
  
  static find(name) {
    return colliders.get(name);
  }
  
  static findOrThrow(name) {
    let collider = this.find(name);
    if (collider != null) return collider;
    else throw new Error(`Unknown collider '${ name }'`);
  }
  
  static create(name, entity) {
    let Collider = this.findOrThrow(name);
    let collider = new Collider();
    collider.update(entity);
    return collider;
  }
  
};
