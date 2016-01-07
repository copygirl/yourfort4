require! events: { EventEmitter }

module.exports = class Main implements EventEmitter::
  (@side) ->
    EventEmitter.call this
    @entities = { }
    @next-entity-id = 1
  
  add: (entity) !->
    if entity.main?
      throw new Error "Entity #entity already spawned"
    
    entity.main = this
    entity.id = @next-entity-id++
    @entities[entity.id] = entity
    
    @emit \spawn, entity
  
  remove: (entity) !->
    if entity.main != this
      throw new Error "Entity #entity not spawned"
    
    delete @entities[entity.id]
    entity.main = entity.id = null
    
    @emit \despawn, entity
