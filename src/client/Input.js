"use strict";

let keys = {
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right"
}


module.exports = class Input {
  
  constructor(game) {
    this.game = game;
    this.mouse = [ 0, 0 ];
    this.mouse.inside = false;
    
    window.addEventListener("mousemove", (ev) => {
      let rect = this.game.canvas.getBoundingClientRect();
      this.mouse = [
        Math.floor((ev.clientX - rect.left) / this.game.graphics.scale),
        Math.floor((ev.clientY - rect.top) / this.game.graphics.scale) ];
      this.mouse.inside =
        ((this.mouse[0] >= 0) && (this.mouse[0] < this.game.canvas.width) &&
         (this.mouse[1] >= 0) && (this.mouse[1] < this.game.canvas.height));
    });
    this.game.canvas.addEventListener("mouseleave", (ev) => {
      this.mouse.inside = false; });
    
    // Initialize control values.
    for (let key in keys)
      this[keys[key]] = false;
    
    // Creates a function that will handle keydown and keyup
    // events and set the control corresponding to the key
    // pressed/released to the specified value.
    let setControl = (value) => (ev) => {
      let control = keys[ev.code];
      if (control == null) return;
      this[control] = value;
      ev.preventDefault();
    };
    
    window.addEventListener("keydown", setControl(true));
    window.addEventListener("keyup", setControl(false));
  }
  
};
