"use strict";

let Side         = require("./Side");
let PacketType   = require("./PacketType");
let PacketReader = require("./PacketReader");
let PacketWriter = require("./PacketWriter");
let { extend, type, UnexpectedTypeError } = require("../utility");

let reader = new PacketReader();
let writer = new PacketWriter();


let Packet = module.exports = class Packet {
  
  constructor(packetType, payload) {
    this.packetType = packetType;
    this.payload    = payload;
    extend(this, payload);
  }
  
  static write(packetType, payload = { }, side = Side.BOTH) {
    if (typeof packetType == "string")
      packetType = PacketType.findOrThrow(packetType);
    if (!(packetType instanceof PacketType))
      throw new UnexpectedTypeError(packetType, PacketType, String);
    
    packetType.verify(payload);
    writer.write(packetType, payload, side);
  }
  
  static parse(target, data, side = Side.BOTH) {
    let view;
    if (data instanceof ArrayBuffer)
      view = new DataView(data);
    else if (data instanceof Uint8Array)
      view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    else throw new UnexpectedTypeError(data, ArrayBuffer, Uint8Array);
    
    let [ packetType, payload ] = reader.read(view, side);
    
    packetType.exec(target, payload);
    // throw new Error(`Error while executing packet '${ packetType }':\n${ e }");
  }
  
};
Packet.MAX_PACKET_SIZE = 512;
