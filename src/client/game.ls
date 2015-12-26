require! {
  "../common/entity": Entity
  "../common/block": Block
  "./input": Input
  "./assets": Assets
  "./graphics": Graphics
  "./client": Client
}

window.request-animation-frame ?= set-timeout _, 33

export class Game
  (@canvas, size, scale) ->
    @input = new Input this
    @assets = new Assets this
    @graphics = new Graphics this, @canvas, size, scale
    @client = new Client this
    
    @next-entity-id = 1
    @entities = { }
    @entities-renderable = { }
    @entities-collidable = { }
  
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

for x from 16 til 240 by 16
  (new Block game) <<< pos: [x, 16], color: [1, 0, 0, 1]
  (new Block game) <<< pos: [x, 160 - 16], color: [0, 1, 0, 1]
for y from 32 til 160 - 16 by 16
  (new Block game) <<< pos: [16, y], color: [0, 0, 1, 1]
  (new Block game) <<< pos: [240 - 16, y], color: [1, 1, 0, 1]

game.run 30
