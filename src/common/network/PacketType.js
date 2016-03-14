"use strict";

let Side     = require("./Side");
let DataType = require("./DataType");
let { type } = require("../utility");


let packets = {
  byId: new Array(256),
  byName: { }
};


module.exports = class PacketType {
  
  constructor(id, name, side, payload, ...exec) {
    this.id      = id;
    this.name    = name;
    this.side    = side;
    
    if (typeof id != "number") throw new Error(
      `Expected number for packet ID, got ${ type(id) }`);
    if ((id < 0) || (id > 255)) throw new Error(
      `Packet ID '${ id }' isn't in the valid range (0 - 255)`);
    if (PacketType.find[id] != null) throw new Error(
      `Packet ID '${ id }' is already used by packet ${ PacketType.find[id] }`);
    
    packets.byId[id] = this;
    packets.byName[name] = this;
    
    // Find the datatypes that make up this packet, throwing an error if one's invalid.
    // Also if all datatypes have a static size, keep track of it in this packet type.
    this.size = 0;
    this.payload = payload.map(field => {
      for (let name in field) {
        let dataType = DataType.findOrThrow(field[name]);
        if (this.size != null) {
          if (typeof dataType.size == "number")
            this.size += dataType.size;
          else this.size = null;
        }
        return [ name, dataType ];
      }
    });
    
    this.exec = ((exec.length > 1)
      ? (target, packet) => {
          let side = target.side || target.main.side;
          exec[side - 1](target, packet); }
      : exec[0]);
  }
  
  getSize(payload) {
    if (this.size != null) return this.size;
    let size = 0;
    for (let [ name, dataType ] of this.payload)
      size += dataType.getSize(this.payload[name]);
    return size;
  }
  
  toString() { return `[PacketType ${ this.name.toUpperCase() }]`; }
  
  verify(payload) {
    if (Object.keys(payload).length > Object.keys(this.payload).length)
      throw new Error(`Invalid payload for ${ this }: Too many fields`);
    for (let [ name, dataType ] of this.payload) {
      let value = payload[name];
      if (value == null) throw new Error(
        `Invalid payload for ${ this }: Missing field '${ name }'`);
      try { dataType.verify(value); }
      catch (e) { throw new Error(
        `Error validating field '${ name }' of ${ this }:\n${ e }`); }
    }
  }
  
  static find(idOrName) {
    switch (typeof idOrName) {
      case "number": return packets.byId[idOrName];
      case "string": return packets.byName[idOrName.toLowerCase()];
      default: throw new Error(`Expected number or string, got '${ type(idOrName) }'`);
    }
  }
  
  static findOrThrow(idOrName) {
    let packetType = PacketType.find(idOrName);
    if (packetType == null) throw new Error(
      `Unknown packet type ID or name '${ idOrName }'`);
    return packetType;
  }
  
  static define(...args) {
    return new PacketType(...args);
  }
  
};
