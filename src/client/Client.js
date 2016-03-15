"use strict";

let { EventEmitter } = require("events");
let Entity           = require("../common/Entity");
let { Packet, Side } = require("../common/network");
let { implement }    = require("../common/utility");


let url = "ws://localhost:42006/";

Object.defineProperties(Entity.prototype, {
  networkId: { value: null, writable: true },
  networked: { get: function() { return (this.networkId != null); } }
});


module.exports = implement(class Client {
  
  constructor(game) {
    EventEmitter.call(this);
    
    this.game      = game;
    this.socket    = null;
    this.connected = false;
    this.ownId     = null;
    
    this.tracking = new Set();
    
    this.game.on("spawn", (entity) => {
      if (entity.networked)
        this.tracking.add(entity); });
    this.game.on("despawn", (entity) => {
      this.tracking.delete(entity); });
  }
  
  get loggedIn() { return (this.connected && (this.ownId != null)); }
  
  send(packetType, payload) {
    if (!this.connected) throw new Error("Not connected");
    this.socket.send(Packet.write(packetType, payload, Side.CLIENT));
  }
  
  connect() {
    if (this.socket != null) throw new Error("Already connected / connecting");
    this.socket = new WebSocket(url);
    this.socket.binaryType = "arraybuffer";
    
    this.socket.addEventListener("open", () => {
      this.connected = true;
      this.emit("connect");
      this.send("login");
    });
    this.socket.addEventListener("close", ({ reason }) => {
      if (!this.connected) return;
      this.emit("disconnect", reason);
    });
    this.socket.addEventListener("message", ({ data }) => {
      Packet.parse(this.game, data, Side.CLIENT);
    });
  }
  
  disconnect(reason) {
    if (this.socket == null) throw new Error("Not connected");
    this.socket.close(1000, reason);
  }
  
}, EventEmitter);
