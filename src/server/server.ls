require! {
  ws: { Server: WebSocketServer }
  "../common/main": Main
  "../common/block": Block
  "../common/network/side": Side
}

module.exports = class Server extends Main
  (@port) ->
    super Side.SERVER
  
  start: ->
    @wss = new WebSocketServer port: @port
    @wss.on \connection, (ws) !~>
      console.log "'#ws' connected"
      ws.on \message, (message) !~>
        console.log "'#ws' sent: #message"
      ws.on \close, (code, message) !~>
        console.log "'#ws' disconnected: #message"
  
  stop: (reason = "Shutting down ...") ->
    ...


server = new Server 42006

for x from 16 til 240 by 16
  server.add new Block! <<< pos: [x, 16], color: [1, 0, 0, 1]
  server.add new Block! <<< pos: [x, 160 - 16], color: [0, 1, 0, 1]
for y from 32 til 160 - 16 by 16
  server.add new Block! <<< pos: [16, y], color: [0, 0, 1, 1]
  server.add new Block! <<< pos: [240 - 16, y], color: [1, 1, 0, 1]

server.start!
