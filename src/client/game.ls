require! {
  events: { EventEmitter }
  "../common/main": Main
  "../common/network/side": Side
  "./input": Input
  "./assets": Assets
  "./graphics": Graphics
  "./client": Client
}


export class Game extends Main
  (@canvas, size, scale) ->
    super Side.CLIENT
    @input = new Input this
    @client = new Client this
    @assets = new Assets this
    @graphics = new Graphics this, @canvas, size, scale
  
  run: (fps) !->
    <~! @assets.load "loading-screen"
    @graphics.init!
    @update!
    <~! @assets.load "game"
    @client.connect!
  
  update: !->
    @graphics.render!
    request-animation-frame @~update


<- window.add-event-listener "load"
canvas = document.get-element-by-id \game
game = window.game = new Game canvas

game.client.on \connect, !-> console.log "Connected"
game.client.on \disconnect, (reason) !-> console.log "Disconnected (#reason)"
game.client.on \login, !-> console.log "Logged in with ID '#{game.client.own-id}'"

game.run 30
