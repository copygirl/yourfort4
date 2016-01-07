require! {
  events: { EventEmitter }
  "../common/packets"
  "../common/entity": Entity
  "../common/network/packet": Packet
  "../common/network/side": Side
}


url = "ws://localhost:42006/"

Object.define-properties Entity::,
  network-id: value: null, writable: true
  networked:  get: -> @network-id?


module.exports = class Client implements EventEmitter::
  (@game) ->
    EventEmitter.call this
    @socket = null
    @connected = false
    @own-id = null
    
    @tracking = { }
    
    @game.on \spawn, (entity) !~>
      if entity.networked
        @tracking[entity.network-id] = entity
    @game.on \despawn, (entity) !~>
      delete! @tracking[entity.network-id]
  
  logged-in:~ -> (@connected && @own-id?)
  
  send: (packet-type, payload) !->
    if !@connected then throw new Error "Not connected"
    @socket.send Packet.write packet-type, payload, Side.CLIENT
  
  connect: !->
    if @socket? then throw new Error "Already connected / connecting"
    @socket = new WebSocket url
    @socket.binary-type = \arraybuffer
    
    @socket.add-event-listener \open, !~>
      @connected = true
      @emit \connect
      @send \login
    
    @socket.add-event-listener \close, ({ reason }) !~>
      if !@connected then return
      @emit \disconnect, reason
    
    @socket.add-event-listener \message, ({ data }) !~>
      Packet.parse @game, data, Side.CLIENT
  
  disconnect: (reason) !->
    if !@socket? then throw new Error "Not connected"
    @socket.close 1000, reason
