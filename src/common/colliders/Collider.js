let colliders = new Map();

module.exports = class Collider {
  
  get boundingBox() { throw new Error("Not implemented"); }
  
  update() { throw new Error("Not implemented"); }
  
  ray(x1, y1, x2, y2) { throw new Error("Not implemented"); }
  
  expand(shape) { throw new Error("Not implemented"); }
  
  
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
