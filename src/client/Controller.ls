module.exports = class Controller
  (@game) ->
  
  update: !->
    @game.player?.movement <<<
      left:  @game.input.left
      right: @game.input.right
      jump:  @game.input.up
