"use strict";

let Player = require("../common/Player");
let { Side, Packet } = require("../common/network");

module.exports = class PlayerServer extends Player {
  
  constructor(socket) {
    super();
    this.socket    = socket;
    this.connected = true;
    this.loggedIn  = false;
    
    setTimeout(
      () => { if (this.loggedIn) this.disconnect("Login timeout"); },
      1000);
  }
  
  send(packetType, payload) {
    if (!this.connected) throw new Error("Not connected");
    this.socket.send(Packet.write(packetType, payload, Side.SERVER));
  }
  
  disconnect(reason) {
    if (!this.connected) return;
    this.socket.close(1000, reason);
  }
  
};
