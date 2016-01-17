require! "./Entity"

module.exports = class Player extends Entity
  ->
    super!
    @size = [ 16, 16 ]
    
    @renderer = \sprite
    @sprite = \player
    
    @physics = true
    @collider = \box
