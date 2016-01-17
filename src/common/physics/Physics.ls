require! "../Entity"
require! "./CollisionMap"
require! "./colliders": { Collider, Box }


update-entity-collider = (e) !->
  if e.main? && e.collider?
    e.collider.update-from-entity e
    e.main.physics.collision.update e


Entity:: <<<
  speed:   [ 0, 0 ]
  gravity: [ 0, 240 ]
  solid:   false
  
  _physics: false
  physics:~
    -> @_physics
    (value) ->
      if value == @_physics then return
      @_physics = value
      if !@main? then return
      if value then @main.physics.updating[@id] = this
      else then delete @main.physics.updating[@id]
  
  _collider: null
  collider:~
    -> @_collider
    (value) ->
      @_collider = if typeof! value == \String
        switch value
          | \box => Box.from-entity this
          | _ => throw new Error "Unknown collider '#value'"
      else if value instanceof Collider then value
      else if value? then throw new Error do
        "Expected String or Collider, got #{ typeof! value }"
      @main?.physics.collision[if value? then \update else \remove] this
  
  _pos: [ 0, 0 ]
  pos:~
    -> @_pos
    (value) ->
      @_pos = value
      update-entity-collider this
  
  _size: [ 0, 0 ]
  size:~
    -> @_size
    (value) ->
      @_size = value
      update-entity-collider this


module.exports = class Physics
  (@main) ->
    @updating = { }
    @collision = new CollisionMap!
    
    @main.on \spawn, (entity) !~>
      if entity.physics
        @updating[entity.id] = entity
      if entity.collider?
        update-entity-collider entity
        @collision.update entity
      else if entity.solid then throw new Error do
        "#entity is solid, but is missing a collider"
    
    @main.on \despawn, (entity) !~>
      delete @updating[entity.id]
      if entity.collider?
        @collision.update entity
  
  update: (delta) !->
    for _, entity of @updating
      entity.speed = for i til 2 then entity.speed[i] + entity.gravity[i] * delta
      moving = false; for i til 2 then if entity.speed[i] != 0 then moving = true; break
      
      speed = for i til 2 then entity.speed[i] * delta
      
      mbox = entity.collider.bounding-box.clone!
      mbox.expand -speed[0] >? 0, -speed[1] >? 0, speed[0] >? 0, speed[1] >? 0
      
      solids = @collision.entities-in-bbox mbox, true
      
      if Object.keys solids .length > 0 then entity.speed = [ 0, 0 ]
      else entity.pos = for i til 2 then entity.pos[i] + speed[i]
