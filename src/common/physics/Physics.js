"use strict";

let Entity       = require("../Entity");
let { Collider } = require("./colliders");
let CollisionMap = require("./CollisionMap");
let { Vector }   = require("../veccy");
let { implement, type, Iterable, UnexpectedTypeError } = require("../utility");


let updateEntityCollider = function(entity) {
  if ((entity.main == null) || (entity.collider == null)) return;
  entity.main.physics.collision.update(entity);
  entity.collider.update(entity);
};


const POS      = Symbol("pos");
const SIZE     = Symbol("size");
const SPEED    = Symbol("speed");
const ACC      = Symbol("acc");

const PHYSICS  = Symbol("physics");
const COLLIDER = Symbol("collider");

implement(Entity, {
  
  [POS]: Vector.create(0, 0),
  get pos() { return this[POS]; },
  set pos(value) {
    this[POS] = Vector.toVector(value);
    updateEntityCollider(this);
  },
  
  [SIZE]: Vector.create(0, 0),
  get size() { return this[SIZE]; },
  set size(value) {
    this[SIZE] = Vector.toVector(value);
    updateEntityCollider(this);
  },
  
  [SPEED]: Vector.create(0, 0),
  get speed() { return this[SPEED]; },
  set speed(value) { this[SPEED] = Vector.toVector(value); },

  [ACC]: Vector.create(0, 240),
  get acc() { return this[ACC]; },
  set acc(value) { this[ACC] = Vector.toVector(value); },
  
  [PHYSICS]: false,
  get physics() { return this[PHYSICS]; },
  set physics(value) {
    if (value === this[PHYSICS]) return;
    this[PHYSICS] = value;
    if (this.main == null) return;
    if (value) this.main.physics.updating.add(this);
    else this.main.physics.updating.delete(this);
  },
  
  [COLLIDER]: null,
  get collider() { return this[COLLIDER]; },
  set collider(value) {
    if (value == this[COLLIDER]) return;
    if ((value != null) && (typeof value != "string") && !(value instanceof Collider))
      throw new UnexpectedTypeError(value, Collider, String, null);
    this[COLLIDER] = ((value instanceof Collider) ? value : Collider.create(value, this));
    if (this.main != null)
      this.main.physics.collision[(value != null) ? "update" : "remove"](this);
  }
});


module.exports = class Physics {
  
  constructor(main) {
    this.main      = main;
    this.updating  = new Set();
    this.collision = new CollisionMap();
    
    this.main.on("spawn", (entity) => {
      if (entity.physics)
        this.updating.add(entity);
      if (entity.collider != null) {
        entity.collider.update(entity);
        this.collision.update(entity);
      } else if (entity.solid) throw new Error(
        `${ entity } is solid, but is missing a collider`);
    });
    this.main.on("despawn", (entity) => {
      this.updating.delete(entity);
      if (entity.collider != null)
        this.collision.remove(entity);
    });
  }
  
  update(delta) {
    for (let entity of this.updating)
      this.updateEntity(entity, delta);
  }
  
  updateEntity(entity, delta) {
    entity.speed = entity.speed.add(entity.acc.multiply(delta));
    if (entity.speed.lengthSqr < 0.001) return;
    
    let speed = entity.speed.multiply(delta);
    let mBox = entity.collider.boundingBox.clone();
    if (speed[0] > 0) mBox.maxX += speed[0];
    else mBox.minX += speed[0];
    if (speed[1] > 0) mBox.maxY += speed[1];
    else mBox.minY += speed[1];
    
    let solids = this.collision.entitiesInBBox(mBox)
      .filter(e => (e.solid && (e !== entity))).toArray()
      .sort((a, b) => entity.pos.distanceSqr(a.pos) -
                      entity.pos.distanceSqr(b.pos));
    
    for (let solid of solids) {
      let expandedCollider = solid.collider.expand(entity.collider);
      let collision = expandedCollider.ray(entity.pos, speed);
      if (collision == null) continue;
      
      entity.pos = collision.hit;
      speed = speed.subtract(
        Vector.create(...collision.normal)
              .multiply(speed.dot(collision.normal)));
      entity.speed = speed.divide(delta);
    }
    
    if (entity.speed.lengthSqr < 0.001) return;
    entity.pos = entity.pos.add(speed);
  }
  
};
