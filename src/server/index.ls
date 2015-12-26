require! {
  ws: { Server: WebSocketServer }
}

wss = new WebSocketServer port: 42006

wss.on \connection, (ws) !->
  console.log "Connected: #ws"
  ws.send "Testing!"
  
  ws.on \message, (message) !->
    console.log "Received: #message"
