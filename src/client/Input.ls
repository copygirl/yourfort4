keys =
  KeyW: \up
  KeyS: \down
  KeyA: \left
  KeyD: \right


module.exports = class Input
  (@game) ->
    @mouse = [ 0, 0 ] <<< inside: false
    window.add-event-listener \mousemove, (ev) !~>
      rect = @game.canvas.get-bounding-client-rect!
      @mouse =
        Math.floor (ev.clientX - rect.left) / @game.graphics.scale
        Math.floor (ev.clientY - rect.top) / @game.graphics.scale
      @mouse.inside =
        0 <= @mouse[0] < @game.canvas.width and
        0 <= @mouse[1] <= @game.canvas.height
    @game.canvas.add-event-listener \mouseleave, (ev) !~>
      @mouse.inside = false
    
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
