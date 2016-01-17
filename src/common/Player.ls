require! "./Entity"

module.exports = class Player extends Entity
  ->
    super!
    @size = [ 16, 16 ]
    
    @renderer = \sprite
    @sprite = \player
    
    @physics = true
    @collider = \box
    
    @movement = { -left, -right, -jump }
  
  on-ground:~
    -> (@speed[1] == 0) && Object.keys (@main.physics.collision.entities-in-bbox do
      (@collider.bounding-box.clone!.expand -1, -1, -1, 1), true) .length > 0
  
  update: (delta) !->
    @speed[0] = (@movement.right - @movement.left) * 80
    if @movement.jump && @on-ground
      @speed[1] = -160
