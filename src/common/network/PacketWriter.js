"use strict";

let Side   = require("./Side");
let Packet = require("./Packet");

module.exports = class PacketWriter {
  
  write(packetType, payload, side = Side.BOTH) {
    if ((Side.invert(side) & packetType.side) == 0) throw new Error(
      `Attempting to write ${ packetType } from invalid side '${ Side.toString(side) }'`);
    
    let size = 1 + packetType.getSize(payload);
    if (size > Packet.MAX_PACKET_SIZE) throw new Error(
      `${ packetType } exceeded maximum packet size (${ size } > ${ Packet.MAX_PACKET_SIZE })`);
    
    let buffer = new ArrayBuffer(size);
    let view = new DataView(buffer);
    view.setUint8(0, packetType.id);
    
    let index = 1;
    try {
      for (let [ name, dataType ] of packetType.payload)
        index += dataType.write(view, index, payload[name]);
    } catch (e) { throw new Error(
      `Error while writing packet ${ packetType }:\n${ e }`); }
    
    return buffer;
  }
  
};
