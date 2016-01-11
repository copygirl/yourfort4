require! "./entity": Entity

module.exports = class Block extends Entity
  ->
    super!
    @size = [ 16, 16 ]
    
    @renderer = \sprite
    @sprite = \block
