url = "ws://localhost:42006/"

module.exports = class Client
  (@game) ->
    @socket = null
  
  connect: !->
    if @socket? then throw new Error "Already connected"
    @socket = socket = new WebSocket url
    
    socket.onopen = !->
      socket.send "Hello, server!"
      console.log "Connected!"
    
    socket.onclose = ({ reason }) !->
      console.log "Disconnected! (Reason: #reason)"
    
    socket.onmessage = ({ data }) !->
      console.log "Received: #data"
    
    socket.onerror = (err) !-> throw err
  
  disconnect: (reason = "DISCONNECT") !->
    if !socket? then throw new Error "Not connected"
    socket.close reason
