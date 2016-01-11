require! {
  "./packetType": PacketType
  "./packetReader": PacketReader
  "./packetWriter": PacketWriter
}

reader = new PacketReader!
writer = new PacketWriter!

module.exports = class Packet
  (@packet-type, @payload) ->
    this <<< @payload
  
  @MAX_PACKET_SIZE = 512
  
  @write = (packet-type, payload = { }, side = Side.BOTH) ->
    if typeof! packet-type == \String
      packet-type = PacketType.find-or-throw packet-type
    if packet-type !instanceof PacketType
      throw new Error "Expected PacketType or string, 
                       got '#{ typeof! packet-type }'"
    
    packet-type.verify payload
    writer.write packet-type, payload, side
  
  @parse = (target, data, side = Side.BOTH) !->
    view = switch
      | data instanceof ArrayBuffer => new DataView data
      | data instanceof Uint8Array => new DataView data.buffer, data.byte-offset, data.byte-length
      | _ => throw new Error "Expected ArrayBuffer or Uint8Array, got '#{ typeof! data }'"
    
    [ packet-type, payload ] = reader.read view, side
    
    packet-type.exec target, payload
    # catch then throw new Error do
    #   "Error while executing packet #packet-type:\n#e"
