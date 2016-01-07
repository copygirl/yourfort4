keys =
  KeyW: \up
  KeyS: \down
  KeyA: \left
  KeyD: \right


module.exports = class Input
  (@game) ->
    @mouse = [0, 0]
    window.add-event-listener \mousemove, (ev) !~>
      rect = @game.canvas.get-bounding-client-rect!
      @mouse =
        (ev.clientX - rect.left) / 2
        (ev.clientY - rect.top) / 2
    
    for _, key-name of keys
      @[key-name] = false
    window.add-event-listener \keydown, (ev) !~>
      if !(key-name = keys[ev.code])? then return
      @[key-name] = true
      ev.prevent-default!
    window.add-event-listener \keyup, (ev) !~>
      if !(key-name = keys[ev.code])? then return
      @[key-name] = false
      ev.prevent-default!
