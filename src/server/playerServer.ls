require! {
  "../common/player": Player
  "../common/network/packet": Packet
  "../common/network/side": Side
}

module.exports = class PlayerServer
  (@socket) ->
    @connected = true
    @logged-in = false
    set-timeout do
      ~> if !@logged-in
        @disconnect "Login timeout"
      1000
  
  send: (packet-type, payload) !->
    if !@connected then throw new Error "Not connected"
    @socket.send Packet.write packet-type, payload, Side.SERVER
  
  disconnect: (reason) !->
    if !@connected then return
    @socket.close 1000, reason
