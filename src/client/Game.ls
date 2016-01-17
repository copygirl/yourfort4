require! {
  events: { EventEmitter }
  "../common/Main"
  "../common/Block"
  "../common/Player"
  "../common/network": { Side }
  "./Input"
  "./Controller"
  "./Client"
  "./Assets"
  "./graphics": { Graphics }
}

export class Game extends Main
  (@canvas, size, scale) ->
    super Side.CLIENT
    
    @input      = new Input this
    @controller = new Controller this
    @client     = new Client this
    @assets     = new Assets this
    @graphics   = new Graphics this, @canvas, size, scale
    
    # Using a web worker, we can avoid set-interval running at
    # crippled speed when the tab is in the background. Justice!
    @worker = new Worker "worker.js"
  
  player:~
    -> @client.tracking[@client.own-id]
  
  run: (ups = 30) !->
    <~! @assets.load "loading-screen"
    @graphics.init!
    <~! @assets.load "game"
    @emit \ready
    interval = 1 / ups
    @worker.post-message interval * 1000
    @worker.add-event-listener \message, !~> @update interval
    @client.connect!
  
  update: (delta) !->
    @controller.update!
    super delta


<- window.add-event-listener "load"
canvas = document.get-element-by-id \game
game = window.game = new Game canvas

game.client.on \connect, !-> console.log "Connected"
game.client.on \disconnect, (reason) !-> console.log "Disconnected (#reason)"
game.client.on \login, !->
  console.log "Logged in with ID '#{game.client.own-id}'"
  game.add player = new Player! <<< pos: [ 64, 64 ], network-id: game.client.own-id

game.run!
