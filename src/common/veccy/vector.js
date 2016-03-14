let { type, rangeCheck,
      repeat, any, map, zip,
      aggregate, sum, join } = require("../utility");


let makeIncompatibleVectorsError = function(a, b, what) {
  return new Error(`Can't ${ what } two vectors of dimensions ${ a.dimensions } and ${ b.dimensions }`);
};


module.exports = class Vector {
  
  constructor(elements) {
    this.elements = elements;
  }
  
  static create(...elements) {
    if (elements.length < 1)
      throw new Error("Vector must have at least 1 dimension");
    if (any(elements, e => (typeof e != "number")))
      throw new Error(`Attempting to create Vector with non-number elements ([${ join(map(elements, type), ", ") }])`)
    return new Vector(elements);
  }
  
  static zero(dimensions) {
    return Vector.create(...repeat(0, dimensions)); }
  
  static one(dimensions) {
    return Vector.create(...repeat(1, dimensions)); }
  
  static unit(dimensions, unitDim) {
    if (!rangeCheck(unitDim, 0, dimensions - 1))
      throw new Error("unitDim is out of range")
    let v = Vector.zero(dimensions);
    v.elements[unitDim] = 1;
    return v;
  }
  
  static toVector(obj, inspectArray = false) {
    if (obj instanceof Vector) return obj;
    if (obj instanceof Array) {
      if (obj.length == 1) {
        if (obj[0] instanceof Vector) return obj[0];
        if (obj[0] instanceof Array) return Vector.create(...obj[0]);
      }
      return Vector.create(...obj);
    }
    throw new Error(`Can't convert object of type ${ type(obj) } to Vector`);
  }
  
  
  get dimensions() { return this.elements.length; }
  
  get lengthSqr() { return sum(map(this, e => e * e)); }
  
  get length() { return Math.sqrt(this.lengthSqr); }
  
  get sum() { return aggregate(this, (a, b) => a + b); }
  
  get product() { return aggregate(this, (a, b) => a * b); }
  
  
  clone() { return new Vector(this.elements.slice(0)); }
  
  negate() { return Vector.create(...map(this, e => -e)); }
  
  normalize() {
    let l = this.length;
    return ((l == 0) ? Vector.zero(this.dimensions)
                     : Vector.create(...map(this, e => e / l)));
  }
  
  
  multiply(f) { return Vector.create(...map(this, e => e * f)); }
  
  
  add(...v) {
    v = Vector.toVector(v, true);
    if (this.dimensions != v.dimensions)
      throw makeIncompatibleVectorsError(this, v, "add");
    return Vector.create(...zip(this, v, (a, b) => a + b));
  }
  
  subtract(...v) {
    v = Vector.toVector(v, true);
    if (this.dimensions != v.dimensions)
      throw makeIncompatibleVectorsError(this, v, "subtract");
    return Vector.create(...zip(this, v, (a, b) => a - b));
  }
  
  dot(...v) {
    v = Vector.toVector(v, true);
    if (this.dimensions != v.dimensions)
      throw makeIncompatibleVectorsError(this, v, "dot");
    return sum(zip(this, v, (a, b) => a * b));
  }
  
  cross(...v) {
    v = Vector.toVector(v, true);
    if ((this.dimensions != 3) || (v.dimensions != 3))
      throw makeIncompatibleVectorsError(this, v, "cross");
    let [ x, y, z ] = this;
    let [ a, b, c ] = v;
    return Vector.create((y * c) - (z * b),
                         (z * a) - (x * c),
                         (x * b) - (y * a));
  }
  
  
  [Symbol.iterator]() { return this.elements[Symbol.iterator](); }
  
  toString() { return `[Vector(${ this.dimensions }) ${ this.elements.join(", ") } ]`; }
  
};
