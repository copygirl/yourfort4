"use strict";

let { type, implement, rangeCheck, Iterable } = require("../utility");


let makeIncompatibleVectorsError = function(a, b, what) {
  return new Error(`Can't ${ what } two vectors of dimensions ${ a.dimensions } and ${ b.dimensions }`);
};


let Vector = module.exports = class Vector {
  
  constructor(elements) {
    this.elements = elements;
  }
  
  static create(...elements) {
    if (elements.length < 1)
      throw new Error("Vector must have at least 1 dimension");
    if (Iterable.any(elements, e => (typeof e != "number")))
      throw new Error(`Attempting to create Vector with non-number elements ([${ Iterable.map(elements, type).join(", ") }])`)
    return new Vector(elements);
  }
  
  static zero(dimensions) {
    return Vector.create(Iterable.repeat(0, dimensions)); }
  
  static one(dimensions) {
    return Vector.create(Iterable.repeat(1, dimensions)); }
  
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
      if (inspectArray && (obj.length == 1)) {
        if (obj[0] instanceof Vector) return obj[0];
        if (obj[0] instanceof Array) return Vector.create(...obj[0]);
      }
      return Vector.create(...obj);
    }
    throw new Error(`Can't convert object of type ${ type(obj) } to Vector`);
  }
  
  
  get dimensions() { return this.elements.length; }
  
  get lengthSqr() { return Iterable.map(this, e => e * e).sum(); }
  
  get length() { return Math.sqrt(this.lengthSqr); }
  
  get sum() { return Iterable.aggregate(this, (a, b) => a + b); }
  
  get product() { return Iterable.aggregate(this, (a, b) => a * b); }
  
  
  clone() { return new Vector(this.elements.slice(0)); }
  
  map(func) { return Vector.create(...Iterable.map(this, func)); }
  
  negate() { return this.map(e => -e); }
  
  normalize() {
    let l = this.length;
    return ((l == 0) ? Vector.zero(this.dimensions) : this.map(e => e / l));
  }
  
  
  zip(v, what, func) {
    v = Vector.toVector(v, true);
    if (typeof what == "function") {
      func = what;
      what = "zip";
    }
    if (this.dimensions != v.dimensions)
      throw makeIncompatibleVectorsError(this, v, what);
    return Vector.create(...Iterable.zip(this, v, func));
  }
  
  add(...v) { return this.zip(v, "add", (a, b) => a + b); }
  
  subtract(...v) { return this.zip(v, "subtract", (a, b) => a - b); }
  
  multiply(...v) {
    return (((v.length == 1) && (typeof v[0] == "number"))
      ? this.map(e => e * v[0])
      : this.zip(v, "multiply", (a, b) => a * b));
  }
  
  dot(...v) {
    v = Vector.toVector(v, true);
    if (this.dimensions != v.dimensions)
      throw makeIncompatibleVectorsError(this, v, "dot");
    return Iterable.zip(this, v, (a, b) => a * b).sum();
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

// Define indexed accessors:
for (let i = 0; i < 10; i++) {
  implement(Vector, { get [i]() { return this.elements[i]; } });
}
