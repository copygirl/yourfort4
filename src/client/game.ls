require! {
  events: { EventEmitter }
  "../common/main": Main
  "../common/player": Player
  "../common/network/side": Side
  "./input": Input
  "./controller": Controller
  "./assets": Assets
  "./graphics": Graphics
  "./client": Client
}


export class Game extends Main
  (@canvas, size, scale) ->
    super Side.CLIENT
    @input = new Input this
    @controller = new Controller this
    @assets = new Assets this
    @graphics = new Graphics this, @canvas, size, scale
    @client = new Client this
  
  player:~
    -> @client.tracking[@client.own-id]
  
  run: (fps = 30) !->
    <~! @assets.load "loading-screen"
    @graphics.init!
    <~! @assets.load "game"
    @emit \ready
    set-interval @~update, 1000 / fps
    @client.connect!
  
  update: !->
    @controller.update!


<- window.add-event-listener "load"
canvas = document.get-element-by-id \game
game = window.game = new Game canvas

game.client.on \connect, !-> console.log "Connected"
game.client.on \disconnect, (reason) !-> console.log "Disconnected (#reason)"
game.client.on \login, !->
  console.log "Logged in with ID '#{game.client.own-id}'"
  game.add player = new Player! <<< network-id: game.client.own-id

game.run!
