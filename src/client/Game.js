"use strict";

let { EventEmitter } = require("events");

let Main   = require("../common/Main");
let Block  = require("../common/Block");
let Player = require("../common/Player");
let { Side } = require("../common/network");
let { extend } = require("../common/utility");

let Input      = require("./Input");
let Controller = require("./Controller");
let Client     = require("./Client");
let Assets     = require("./Assets");
let { Graphics } = require("./graphics");


let Game = module.exports = class Game extends Main {
  
  constructor(canvas, size, scale) {
    super(Side.CLIENT);
    
    this.canvas     = canvas;
    this.input      = new Input(this);
    this.controller = new Controller(this);
    this.client     = new Client(this);
    this.assets     = new Assets(this);
    this.graphics   = new Graphics(this, canvas, size, scale);
  }
  
  get player() { return this.entities.get(this.client.ownId); }
  
  run(ups = 30) {
    this.assets.load("loading-screen", () => {
      this.graphics.init();
      this.assets.load("game", () => {
        this.emit("ready");
        let interval = 1 / ups;
        setInterval(
          this.update.bind(this, interval),
          interval * 1000
        );
      });
    });
  }
  
  update(delta) {
    this.controller.update();
    super.update(delta);
  }
  
};

window.addEventListener("load", () => {
  let canvas = document.getElementById("game");
  let game = window.game = new Game(canvas);
  
  game.client.on("connect", () => { console.log("Connected"); });
  game.client.on("disconnect", (reason) => { console.log(`Disconnected (${ reason })`); });
  game.client.on("login", () => {
    console.log(`Logged in with ID '${ game.client.ownId }'`);
    game.add(extend(new Player(), { pos: [ 64, 64 ], networkId: game.client.ownId }));
  });
  game.run();
});
