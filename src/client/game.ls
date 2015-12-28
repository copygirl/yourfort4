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
  
  add: (entity) !->
    if entity.id?
      throw new Error "Entity #entity already spawned"
    
    entity.game = this
    entity.id = @next-entity-id++
    @entities[id] = entity
    
    if entity.renderer?
      @entities-renderable[entity.id] = entity
  
  remove: (entity) !->
    if entity.game != this
      throw new Error "Entity #entity not spawned"
    entity.game = entity.id = null
    delete @entities[id]
  
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
  game.add new Block! <<< pos: [x, 16], color: [1, 0, 0, 1]
  game.add new Block! <<< pos: [x, 160 - 16], color: [0, 1, 0, 1]
for y from 32 til 160 - 16 by 16
  game.add new Block! <<< pos: [16, y], color: [0, 0, 1, 1]
  game.add new Block! <<< pos: [240 - 16, y], color: [1, 1, 0, 1]

game.run 30
