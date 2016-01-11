module.exports = class Entity
  ->
    @main = null
    @id = null
    
    @pos  = [ 0, 0 ]
    @size = [ 0, 0 ]
  
  spawned:~ -> @id?
  
  to-string: ->
    "[" + typeof! this + (if !@id? then " (#{@id})" else "") + "]"
