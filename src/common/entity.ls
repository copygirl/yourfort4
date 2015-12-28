module.exports = class Entity
  ->
    @game = null
    @id = null
    
    @pos = [0, 0]
    @size = [0, 0]
    @solid = false
    
    # Changing renderer after entity has been
    # spawned doesn't have any effect currently.
    @renderer = null
    @sprite = null
    @color = [1, 1, 1, 1]
  
  to-string: ->
    (typeof! this) + (if !@id? then " (#{@id})" else "")
