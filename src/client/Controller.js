"use strict";

let controlMap = {
  left: "left",
  right: "right",
  up: "jump"
};

module.exports = class Controller {
  
  constructor(game) {
    this.game = game;
  }
  
  update() {
    if (this.game.player == null) return;
    for (let input in controlMap) {
      let control = controlMap[input];
      this.game.player.movement[control] = this.game.input[input];
    }
  }
  
};
