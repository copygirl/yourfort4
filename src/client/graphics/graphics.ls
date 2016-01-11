require! {
  sylvester: { Matrix }
  "../../common/entity": Entity
  "./shader": Shader
  "./program": Program
  "./buffer": Buffer
  "./renderers"
  "./glUtils"
}


create-webGL-context = (canvas) ->
  gl = try (canvas.get-context \webgl) ? canvas.get-context \experimental-webgl
  if !gl? then throw Error "Couldn't create WebGL context"
  if WebGLDebugUtils? then gl = WebGLDebugUtils.make-debug-context gl

Object.define-properties Entity::,
  renderer: value: null, writable: true
  sprite:   value: null, writable: true
  color:    value: [1, 1, 1, 1], writable: true


module.exports = class Graphics
  (@game, @canvas, size = [450, 275], scale = 2) ->
    @gl = create-webGL-context @canvas
    
    @matrix-stack = [ ]
    @proj-matrix = null
    @view-matrix = Matrix.I 4
    @resize size, scale
    
    @background = [0.0675, 0.125, 0.25, 1]
    
    @renderers =
      sprite: new renderers.SpriteRenderer this
    
    @renderable = { }
    @game.on \spawn, (entity) !~>
      if entity.renderer?
        @renderable[entity.id] = entity
    @game.on \despawn, (entity) !~>
      delete! @renderable[entity.id]
  
  
  size:~
    -> @canvas<[width height]>
    (size) -> @resize size, @scale
  
  scale:~
    -> @canvas.client-width / @canvas.width
    (scale) -> @resize @canvas<[width height]>, scale
  
  resize: (size, scale) !->
    @canvas<[width height]> = size
    @canvas.style.width  = "#{ size[0] * scale }px"
    @canvas.style.height = "#{ size[1] * scale }px"
    @gl.viewport 0, 0, @canvas.width, @canvas.height
    @proj-matrix = gl-utils.make-ortho 0, @canvas.width, @canvas.height, 0, -128, 128
  
  
  init: !->
    @gl.enable @gl.BLEND
    @gl.blendFunc @gl.SRC_ALPHA, @gl.ONE_MINUS_SRC_ALPHA
    @gl.enable @gl.DEPTH_TEST
    @gl.depth-func @gl.LEQUAL
    @gl.active-texture @gl.TEXTURE0
    
    @program = new Program this,
      ...@game.assets.shaders["default.vs", "default.fs"]
    @program.use!
    
    for uniform in <[ uPMatrix uMVMatrix uColor uSampler ]>
      @program.uniform uniform
    for attr in <[ aVertexPosition aTextureCoord ]>
      @program.attribute attr
    
    request-animation-frame @~render
  
  
  push: (matrix) !->
    matrix ?= @view-matrix.dup!
    @matrix-stack.push @view-matrix
    @view-matrix = matrix
  
  pop: ->
    if @matrix-stack.length <= 0
      throw new Error "Attempting to pop empty matrix stack"
    @view-matrix = @matrix-stack.pop!
  
  
  render: !->
    @gl.clear-color ...@background
    @gl.clear @gl.COLOR_BUFFER_BIT .|. @gl.DEPTH_BUFFER_BIT
    
    @program.uniforms.uPMatrix.setf @proj-matrix
    @program.uniforms.uMVMatrix.setf @view-matrix
    
    for id, entity of @renderable
      @renderers[entity.renderer]?.render entity
    
    if @game.input.mouse.inside
      @renderers.sprite.render do
        sprite: \cursor
        pos:    @game.input.mouse
        size:   [15, 15]
        color:  [1, 1, 1, 1]
    
    request-animation-frame @~render
