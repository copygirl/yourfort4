require! {
  events: { EventEmitter }
  "./physics": { Physics }
}

module.exports = class Main implements EventEmitter::
  (@side) ->
    EventEmitter.call this
    @entities = { }
    @updating = { }
    @next-entity-id = 1
    
    @physics = new Physics this
  
  add: (entity) !->
    if entity.spawned
      throw new Error "Entity #entity already spawned"
    
    entity.main = this
    entity.id = @next-entity-id++
    @entities[entity.id] = entity
    if entity.update?
      @updating[entity.id] = entity
    
    @emit \spawn, entity
  
  remove: (entity) !->
    if entity.main != this
      throw new Error "Entity #entity not spawned"
    
    delete @entities[entity.id]
    if entity.update?
      delete @update[entity.id]
    entity.main = entity.id = null
    
    @emit \despawn, entity
  
  update: (delta) !->
    for _, entity of @updating then entity.update delta
    @physics.update delta
