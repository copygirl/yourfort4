"use strict";

let Entity = require("./Entity");

const MOVE_SPEED = 80;
const JUMP_SPEED = 160;

module.exports = class Player extends Entity {
  
  constructor() {
    super();
    this.size = [ 16, 16 ];
    
    this.renderer = "sprite";
    this.sprite   = "player";
    
    this.physics  = true
    this.collider = "box";
    
    this.movement = { left: false, right: false, jump: false };
    
    this.onGround = false;
  }
  
  
  update(delta) {
    let box = {
      minX: this.pos[0] - (this.size[0] / 2) + 1,
      maxX: this.pos[0] + (this.size[0] / 2) - 1,
      minY: this.pos[1] + (this.size[1] / 2) - 1,
      maxY: this.pos[1] + (this.size[1] / 2) + 1
    };
    this.onGround = this.main.physics.collision.entitiesInBBox(box)
      .filter(e => (e.solid && (e !== this)))
      .any();
    
    this.speed = [ (this.movement.right - this.movement.left) * MOVE_SPEED, this.speed[1] ];
    if (this.movement.jump && this.onGround)
      this.speed = [ this.speed[0], -JUMP_SPEED ];
  }
  
};
