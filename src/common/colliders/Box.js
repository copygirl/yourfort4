let Collider = require("./Collider");

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
  
  ray(x1, y1, x2, y2) {
    
  }
  
  expand(shape) {
    if (shape instanceof Box) {
      let width  = shape.width;
      let height = shape.height;
      return new Box(this.minX - width / 2, this.minY - height / 2,
                     this.maxX + width / 2, this.maxY + height / 2);
    } else return null;
  }
  
};

Collider.add(Box);
