"use strict";

let Collider = require("./Collider");


let wallTest = function(p, d, i, wi, wj1, wj2, v) {
  if (Math.abs(d[i]) < 0.0001) return null;
  let t = (wi - p[i]) / d[i];
  if ((t < 0) || (t > 1)) return null;
  let pj = p[i ^ 1] * t;
  if ((pj < wj1) || (pj > wj2)) return;
  let hit = [ 0, 0 ];
  hit[i] = wi;
  hit[i ^ 1] = pj;
  return [ hit, v ];
};


let Box = module.exports = class Box extends Collider {
  
  constructor(minX, minY, maxX, maxY) {
    super();
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  
  get center() { return [ (this.minX + this.maxX) / 2,
                          (this.minY + this.maxY) / 2 ]; }
  
  get width() { return (this.maxX - this.minX); }
  get height() { return (this.maxY - this.minY); }
  
  get boundingBox() { return this; }
  
  update(entity) {
    this.minX = (entity.pos[0] - entity.size[0] / 2);
    this.minY = (entity.pos[1] - entity.size[1] / 2);
    this.maxX = (entity.pos[0] + entity.size[0] / 2);
    this.maxY = (entity.pos[1] + entity.size[1] / 2);
  }
  
  intersects(other) {
    return ((this.minX <= other.maxX) && (this.maxX >= other.minX) &&
            (this.minY <= other.maxY) && (this.maxY >= other.minY));
  }
  
  ray(p, d) {
    let result;
    if ((result = wallTest(p, d, 0, this.minX, this.minY, this.maxY, [ -1, 0 ])) != null) return result;
    if ((result = wallTest(p, d, 0, this.maxX, this.minY, this.maxY, [  1, 0 ])) != null) return result;
    if ((result = wallTest(p, d, 1, this.minY, this.minX, this.maxX, [ 0, -1 ])) != null) return result;
    if ((result = wallTest(p, d, 1, this.maxY, this.minX, this.maxX, [ 0,  1 ])) != null) return result;
    return null;
  }
  
  expand(shape) {
    if (shape instanceof Box) {
      let width  = shape.width;
      let height = shape.height;
      return new Box(this.minX - width / 2, this.minY - height / 2,
                     this.maxX + width / 2, this.maxY + height / 2);
    } else return null;
  }
  
  clone() { return new Box(this.minX, this.minY, this.maxX, this.maxY); }
  
  toString() { return `[Box (${ this.minX },${ this.minY }),(${ this.maxX },${ this.maxY })]`; }
  
};

Collider.add(Box);
