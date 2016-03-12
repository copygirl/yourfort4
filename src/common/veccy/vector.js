let { rangeCheck, map, zip, aggregate, sum, repeat } = require("../utility");


let Vector;

let vectorify = function(v, what, dims = null) {
  if (v.length == 1) {
    if (v[0] instanceof Array) v = v[0];
    if (v[0] instanceof Vector) v = v[0].elements;
  }
  if ((what != null) && (this.dimensions != v.length) ||
      (dims != null) && (this.dimensions != dims))
    throw new Error(`Can't ${ what } two vectors of dimensions ${ this.dimensions } and ${ v.length }`);
  return v;
};


Vector = module.exports = class Vector {
  
  constructor(elements) {
    this.elements = elements;
  }
  
  static create(...elements) {
    if (elements.length == 0)
      throw new Error("Vector must have at least 1 dimension");
    return new Vector(vectorify(elements));
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
  
  
  get dimensions() { return this.elements.length; }
  
  get lengthSqr() { return sum(map(this, 0, e => e * e)); }
  
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
  
  
  add(...v) { return Vector.create(...zip(this,
      vectorify.call(this, v, "add"),
      (a, b) => a + b)); }
  
  subtract(...v) { return Vector.create(...zip(this,
      vectorify.call(this, v, "subtract"),
      (a, b) => a - b)); }
  
  dot(...v) { return sum(zip(this,
      vectorify.call(this, v, "dot"),
      (a, b) => a * b)); }
  
  cross(...v) {
    let [ x, y, z ] = this;
    let [ a, b, c ] = vectorify.call(this, v, "cross", 3);
    return Vector.create((y * c) - (z * b),
                         (z * a) - (x * c),
                         (x * b) - (y * a));
  }
  
  
  [Symbol.iterator]() { return this.elements[Symbol.iterator]; }
  
  toString() { return `[${ this.elements.join(", ") }]`; }
  
};
