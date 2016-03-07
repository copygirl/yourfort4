"use strict";

let Side       = require("./Side");
let PacketType = require("./PacketType");
let Block      = require("../Block");
let { extend } = require("../utility");

PacketType.define(0, "login", Side.SERVER,
  [ ],
  (player) => {
    if (player.loggedIn)
      throw new Error("Already logged in");
    player.loggedIn = true;
    player.main.emit("login", player);
    player.send("welcome", { id: player.id });
  });

PacketType.define(1, "welcome", Side.CLIENT,
  [ { id: "uint" } ],
  (game, { id }) => {
    if (game.client.loggedIn)
      throw new Error("Already logged in");
    game.client.ownId = id;
    game.client.emit("login");
  });

PacketType.define(2, "spawn", Side.CLIENT,
  [ { id: "uint" },
    { type: "ushort" },
    { x: "int" },
    { y: "int" } ],
  (game, { id, type, x, y }) => {
    if (game.client.tracking[id] != null)
      throw new Error(`Spawned entity '${ id }' multiple times`);
    game.add(extend(new Block(), { networkId: id, pos: [ x, y ]
  }));

PacketType.define(3, "despawn", Side.CLIENT,
  [ { id: "uint" } ],
  (game, { id }) => {
    let entity = game.client.tracking[id];
    if (entity == null)
      throw new Error(`Despawning unknown entity '${ id }'`);
    game.remove(entity);
  });
