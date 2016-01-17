require! "./Collider"

module.exports = class Box extends Collider
  (@left = 0, @top = 0, @right = 0, @bottom = 0) ->
  
  contains: ([ x, y ]) ->
    @left <= x <= @right && @top <= y <= @bottom
  
  intersects: (box) ->
    @left < box.right && @right > box.left &&
    @top < box.bottom && @bottom > box.top
  
  bounding-box:~ -> this
  
  clone: -> new Box @left, @top, @right, @bottom
  
  update: (@left, @top, @right, @bottom) !->
  
  update-from-entity: (e) !->
    @update e.pos[0] - e.size[0] / 2, e.pos[1] - e.size[1] / 2,
            e.pos[0] + e.size[0] / 2, e.pos[1] + e.size[1] / 2
  
  expand: (...args) !->
    switch args.length
      | 1 =>
        if args[0] instanceof Box
          @update @left <? args[0].left, @top <? args[0].left,
                  @right >? args[0].right, @bottom >? args[0].bottom
        else if Array.is-array args[0]
          @update @left <? args[0][0], @top <? args[0][0],
                  @right >? args[0][1], @bottom >? args[0][1]
        else if typeof! box == \Number
          @update @left - args[0], @top - args[0], @right + args[0], @bottom + args[0]
        else throw new Error "Expected Box, Array or Number, got '#{ typeof! box }'"
      | 4 =>
        @update @left - args[0], @top - args[1], @right + args[2], @bottom + args[3]
      | _ => throw new Error "Invalid number of arguments, expected 1 or 4, got #that"
  
  
  @from-entity = (e) ->
    new Box e.pos[0] - e.size[0] / 2, e.pos[1] - e.size[1] / 2,
            e.pos[0] + e.size[0] / 2, e.pos[1] + e.size[1] / 2
