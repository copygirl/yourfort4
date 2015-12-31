require! events: { EventEmitter }

module.exports = class Main implements EventEmitter::
  (@side) ->
    EventEmitter.call this
    @entities = { }
    @next-entity-id = 1
  
  add: (entity) !->
    if entity.game?
      throw new Error "Entity #entity already spawned"
    
    entity.game = this
    entity.id = @next-entity-id++
    @entities[entity.id] = entity
    
    @emit \spawn, entity
  
  remove: (entity) !->
    if entity.game != this
      throw new Error "Entity #entity not spawned"
    
    delete @entities[id]
    entity.game = entity.id = null
    
    @emit \despawn, entity
