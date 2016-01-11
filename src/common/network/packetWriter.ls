require! {
  "./packet": Packet
  "./packetType": PacketType
  "./side": Side
}

module.exports = class PacketWriter
  write: (packet-type, payload, side = Side.BOTH) ->
    if (Side.invert side) .&. packet-type.side == 0
      throw new Error "Attempting to write #packet-type from 
                       invalid side '#{ Side.to-string side }'"
    
    size = 1 + packet-type.get-size payload
    if size > Packet.MAX_PACKET_SIZE
      throw new Error "#packet-type exceeded maximum packet 
                       size (#size > #{Packet.MAX_PACKET_SIZE})"
    
    buffer = new ArrayBuffer size
    view = new DataView buffer
    view.setUint8 0, packet-type.id
    
    index = 1
    try
      for [ name, data-type ] in packet-type.payload
        index += data-type.write view, index, payload[name]
    catch then throw new Error do
      "Error while writing packet #packet-type:\n#e"
    
    buffer
