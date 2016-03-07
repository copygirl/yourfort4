"use strict";

let Entity = require("./Entity");

const MOVE_SPEED = 80;
const JUMP_SPEED = 160;

module.exports = class Player extends Entity {
  
  constructor() {
    super();
    this.size = [ 16, 16 ];
    
    this.renderer = "sprite";
    this.sprite = "player";
    
    this.physics = true
    this.collider = "box";
    
    this.movement = { left: false, right: false, jump: false };
  }
  
  // TODO
  get onGround() { return false; }
  
  update(delta) {
    this.speed[0] = (this.movement.right - this.movement.left) * MOVE_SPEED;
    if (this.movement.jump && this.onGround)
      this.speed[1] = -JUMP_SPEED;
  }
  
};
