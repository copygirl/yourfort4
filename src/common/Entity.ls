module.exports = class Entity
  ->
    @main = null
    @id = null
    
    #  Added by Physics
    # pos     = [ 0, 0 ]
    # size    = [ 0, 0 ]
    # speed   = [ 0, 0 ]
    # gravity = [ 0, 2 ]
    # physics  = false : If true, applies speed and gravity to entity.
    # solid    = false : If true, physics entities collide with this entity.
    # collider = null  : Required for collision. May be set to "box" or null. Automatically converted
    #                  ' to Collider object once added to main object, updated when pos/size changes.
    
    #  Added by Graphics
    # renderer = null : May be set to "sprite".
    # sprite   = null : Required for sprite renderer.
    # color    = [ 1, 1, 1, 1 ]
  
  spawned:~ -> @id?
  
  # Update function. Registered when entity
  # is spawned, then called every tick.
  update: null
  
  to-string: ->
    "[" + typeof! this + (if !@id? then " (#{@id})" else "") + "]"
