module.exports = class Input
  (@game) ->
    @mouse = [0, 0]
    @game.canvas.add-event-listener \mousemove, (ev) !~>
      rect = @game.canvas.get-bounding-client-rect!
      @mouse =
        (ev.clientX - rect.left) / 2
        (ev.clientY - rect.top) / 2
