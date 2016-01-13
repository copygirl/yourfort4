require! {
  ws: { Server: WebSocketServer }
  "../common/Main"
  "../common/Block"
  "../common/network": { Side, Packet }
  "./PlayerServer"
}

module.exports = class Server extends Main
  (@port) ->
    super Side.SERVER
    @clients = { }
  
  start: ->
    @wss = new WebSocketServer port: @port
    @wss.on \connection, (socket) !~>
      player = new PlayerServer socket
      @add player
      @clients[player.id] = player
      @emit \connect, player
      
      socket.on \message, (data) !->
        Packet.parse player, data, Side.SERVER
      
      socket.on \close, (code, reason) !~>
        @emit \disconnect, player
        @remove player
        delete @clients[player.id]
  
  stop: (reason = "Shutting down ...") ->
    ...


server = new Server 42006

server.on \connect, (player) !-> console.log "#{player.id} connected"
server.on \disconnect, (player) !-> console.log "#{player.id} disconnected"

server.on \login, (player) !->
  console.log "#{player.id} logged in"
  for id, entity of server.entities
    if entity instanceof Block
      player.send \spawn, { entity.id, type: 0, x: entity.pos[0], y: entity.pos[1] }

for x from 16 til 240 by 16
  server.add new Block! <<< pos: [ x,       16 ], color: [ 1, 0, 0, 1 ]
  server.add new Block! <<< pos: [ x, 160 - 16 ], color: [ 0, 1, 0, 1 ]
for y from 32 til 160 - 16 by 16
  server.add new Block! <<< pos: [       16, y ], color: [ 0, 0, 1, 1 ]
  server.add new Block! <<< pos: [ 240 - 16, y ], color: [ 1, 1, 0, 1 ]

server.start!
