require! {
  "./packet": Packet
  "./packetType": PacketType
  "./dataType": DataType
  "./side": Side
}

module.exports = class PacketReader
  read: (view, side = Side.BOTH) ->
    if view.byte-length < 1
      throw new Error "Empty packet received"
    if view.byte-length > Packet.MAX_PACKET_SIZE
      throw new Error "Packet exceeds maximum size 
                       (#{view.byte-length} > #{Packet.MAX_PACKET_SIZE})"
    
    packet-type = view.getUint8 0
    packet-type = PacketType.find-or-throw packet-type
    
    if side .&. packet-type.side == 0
      throw new Error "Received #packet-type on invalid side 
                       #{ Side.to-string packet-type.side }"
    
    payload = { }
    index = 1
    try
      for [name, data-type] in packet-type.payload
        [value, size] = data-type.read view, index
        payload[name] = value
        index += size
    catch then throw new Error do
      "Error while reading packet #packet-type:\n#e"
    
    [packet-type, payload]
