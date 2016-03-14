"use strict";

let { Server: WebSocketServer } = require("ws");
let { Side, Packet } = require("../common/network");
let PlayerServer     = require("./PlayerServer");

let Main  = require("../common/Main");
let Block = require("../common/Block");
let { extend } = require("../common/utility");

let Server = module.exports = class Server extends Main {
  
  constructor(port) {
    super(Side.SERVER);
    this.port    = port;
    this.clients = new Set();
  }
  
  start() {
    this.wss = new WebSocketServer({ port: this.port });
    this.wss.on("connection", (socket) => {
      let player = new PlayerServer(socket);
      this.add(player);
      this.clients.add(player);
      this.emit("connect", player);
      
      socket.on("message", (data) => {
        Packet.parse(player, data, Side.SERVER); });
      
      socket.on("close", (code, reason) => {
        this.emit("disconnect", player);
        this.remove(player);
        this.clients.delete(player); });
    });
  }
  
  stop(reason = "Shutting down ...") {
    throw new Error("Not implemted! :O");
  }
  
};

let server = new Server(42006);

server.on("connect", (player) => { console.log(`${ player } connected`); });
server.on("disconnect", (player) => { console.log(`${ player } disconnected`); });

server.on("login", (player) => {
  console.log(`${ player } logged in`);
  for (let entity of server.entities.values())
    if (entity instanceof Block)
      player.send("spawn", { id: entity.id, type: 0, x: entity.pos[0], y: entity.pos[1] });
});

for (let x = 16; x < 240; x += 16) {
  server.add(extend(new Block(), { pos: [ x,       16 ], color: [ 1, 0, 0, 1 ] }));
  server.add(extend(new Block(), { pos: [ x, 160 - 16 ], color: [ 0, 1, 0, 1 ] }));
}
for (let y = 32; y < 160 - 16; y += 16) {
  server.add(extend(new Block(), { pos: [       16, y ], color: [ 0, 0, 1, 1 ] }));
  server.add(extend(new Block(), { pos: [ 240 - 16, y ], color: [ 1, 1, 0, 1 ] }));
}

server.start();
