module.exports = class Entity
  ->
    @game = null
    @id = null
    
    @pos = [0, 0]
    @size = [0, 0]
    @solid = false
    
    # Used by SpriteRenderer
    @sprite = null
    @color = [1, 1, 1, 1]
    
    renderer = null
    Object.define-property this, \renderer,
      get: -> renderer
      set: (value) ->
        if renderer == value then return
        if value?
          if !renderer?
            @game.entities-renderable[@id] = this
        else if renderer?
          delete @game.entities-renderable[@id]
        renderer := value
  
  to-string: ->
    (typeof! this) + (if !@id? then " (#{@id})" else "")
