"use strict";

let Side       = require("./Side");
let PacketType = require("./PacketType");
let Packet     = require("./Packet");

module.exports = class PacketReader {
  
  read(view, side = Side.BOTH) {
    if (view.byteLength < 1)
      throw new Error("Empty packet received");
    if (view.byteLength > Packet.MAX_PACKET_SIZE)
      throw new Error(`Packet exceeds maximum size (${ view.byteLength } > ${ Packet.MAX_PACKET_SIZE })`);
    
    let packetType = PacketType.findOrThrow(view.getUint8(0));
    
    if ((side & packetType.side) == 0)
      throw new Error(`Received ${ packetType } on invalid side ${ Side.toString(packetType.side) }`);
    
    let payload = { };
    let index = 1;
    try {
      for (let [ name, dataType ] of packetType.payload) {
        let [ value, size ] = dataType.read(view, index);
        payload[name] = value;
        index += size;
      }
    } catch (e) { throw new Error(`Error while reading ${ packetType }:\n${ e }`); }
    
    return [ packetType, payload ];
  }
  
};
