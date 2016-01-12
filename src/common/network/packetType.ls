require! {
  "./side": Side
  "./dataType": DataType
}


packets =
  by-id: new Array 256
  by-name: { }


module.exports = class PacketType
  (@id, @name, @side, @payload, ...exec) ->
    if typeof! @id != \Number then throw new Error do
      "Expected number for packet ID, got #{ typeof! @id }"
    if @id < 0 or @id > 255 then throw new Error do
      "Packet ID '#{@id}' isn't in the valid range (0 - 255)"
    if (pack = @@find[@id])? then throw new Error do
      "Packet ID '#{@id}' is already used by packet #pack"
    
    packets.by-id[@id] = this
    packets.by-name[@name] = this
    
    # Find the datatypes that make up this packet, throwing an error if one's invalid.
    # Also if all datatypes have a static size, keep track of it in this packet type.
    @size = 0
    for field, i in @payload
      for name, data-type of field
        data-type = DataType.find-or-throw data-type
        @payload[i] = [ name, data-type ]
        if @size?
          if typeof! data-type.size == \Number
            @size += data-type.size
          else @size = null
    
    @exec = if exec.length > 1
      (target, packet) ->
        side = target.side ? target.main.side
        exec[side - 1] target, packet
    else exec[0]
  
  get-size: (payload) ->
    if @size? then return @size
    size = 0
    for [ name, data-type ] in @payload
      size += data-type.get-size @payload[name]
    size
  
  to-string: -> "[PacketType #{ @name.to-upper-case! }]"
  
  verify: (payload) !->
    if Object.keys(payload).length > Object.keys(@payload).length
      throw new Error "Invalid payload for #this: Too many fields"
    for [ name, data-type ] in @payload
      value = payload[name]
      if !value? then throw new Error do
        "Invalid payload for #this: Missing field '#name'"
      try data-type.verify value
      catch then throw new Error do
        "Error validating field '#name' of #this:\n#e"
  
  @find = (id-or-name) ->
    switch typeof! id-or-name
      | \Number => packets.by-id[id-or-name]
      | \String => packets.by-name[id-or-name.to-lower-case!]
      | _ => throw new Error "Expected number or string, got '#that'?"
  
  @find-or-throw = (id-or-name) ->
    packet-type = @find id-or-name
    if !packet-type? then throw new Error do
      "Unknown packet type ID or name '#id-or-name'"
    packet-type
  
  @define = -> new PacketType ...
