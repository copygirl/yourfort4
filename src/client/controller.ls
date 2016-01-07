module.exports = class Controller
  (@game) ->
  
  update: ->
    if !(player = @game.player)? then return
    player.pos[0] += (@game.input.right - @game.input.left) * 2
    player.pos[1] += (@game.input.down - @game.input.up) * 2
