let Entity       = require("../Entity");
let { Collider } = require("../colliders");
let CollisionMap = require("./CollisionMap");
let { implement, type } = require("../utility");


let updateEntityCollider = function(entity) {
  if ((entity.main == null) || (entity.collider == null)) return;
  this.main.physics.collision.update(entity);
};


const POS      = Symbol("pos");
const SIZE     = Symbol("size");
const PHYSICS  = Symbol("physics");
const COLLIDER = Symbol("collider");

implement(Entity, {
  speed: [ 0, 0 ],
  acc:   [ 0, 240 ],
  
  [POS]: [ 0, 0 ],
  get pos() { return this[POS]; },
  set pos(value) {
    this[POS] = value;
    updateEntityCollider(this);
  },
  [SIZE]: [ 0, 0 ],
  get size() { return this[SIZE]; },
  set size(value) {
    this[SIZE] = value;
    updateEntityCollider(this);
  },
  
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
      throw new Error(`Expected Collider, String or null, got '${ type(value) }'`);
    this[COLLIDER] = Collider.create(value, this);
    if (this.main == null) return;
    this.main.physics.collision[(value != null) ? "update" : "remove"](this);
  }
});


module.exports = class Physics {
  
  constructor(main) {
    this.updating = new Set();
    this.collision = new CollisionMap();
    
    this.main.on("spawn", (entity) => {
      if (entity.physics)
        this.updating.add(entity);
      if (entity.collider != null)
        this.collision.update(entity);
      else if (entity.solid) throw new Error(
        `${ entity } is solid, but is missing a collider`);
    });
    this.main.on("despawn", (entity) => {
      this.updating.delete(entity);
      if (entity.collider != null)
        this.collision.remove(entity);
    });
  }
  
  update(delta) {
    for (let entity of this.updating) {
      entity.speed = entity.speed.map((s, i) => s + entity.acc[i]);
      if ((entity.speed[0] == 0) && (entity.speed[1] == 0)) break;
      
      let dVec = entity.speed.slice(0);
      let mBox = entity.collider.boundingBox.clone();
      if (dVec[0] > 0) mBox.maxX += dVec[0];
      if (dVec[1] > 0) mBox.maxY += dVec[1];
      if (dVec[0] < 0) mBox.minX += dVec[0];
      if (dVec[1] < 0) mBox.minY -= dVec[1];
      
      let [ ...solids ] = this.collision.entitiesInBBox(mBox, true);
      
      find-colliding-entities entity.collider, solids
      
      entity.collider.move ...speed
      
      for _, other in solids
        speed = [ 0, 0 ]
      
      entity.pos = for i til 2 then entity.pos[i] + speed[i]
    }
  }
  
};
