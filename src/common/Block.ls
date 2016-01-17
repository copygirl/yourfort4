require! "./Entity"

module.exports = class Block extends Entity
  ->
    super!
    @size = [ 16, 16 ]
    
    @renderer = \sprite
    @sprite = \block
    
    @solid = true
    @collider = \box
