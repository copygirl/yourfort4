require! {
  sylvester: { Matrix }
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


module.exports = class Graphics
  (@game, @canvas, size = [450, 275], scale = 2) ->
    @gl = create-webGL-context @canvas
    
    @matrix-stack = [ ]
    @proj-matrix = null
    @view-matrix = Matrix.I 4
    @resize size, scale
    
    @renderers =
      sprite: new renderers.SpriteRenderer this
    
    @entities = {  }
    @game.on \spawn, (entity) !~>
      if entity.renderer?
        @entities[entity.id] = entity
    @game.on \despawn, (entity) !~>
      delete! @entities[entity.id]
  
  
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
  
  
  push: (matrix) !->
    matrix ?= @view-matrix.dup!
    @matrix-stack.push @view-matrix
    @view-matrix = matrix
  
  pop: ->
    if @matrix-stack.length <= 0
      throw new Error "Attempting to pop empty matrix stack"
    @view-matrix = @matrix-stack.pop!
  
  
  render: !->
    @gl.clear-color 0, 0, 0, 1
    @gl.clear @gl.COLOR_BUFFER_BIT .|. @gl.DEPTH_BUFFER_BIT
    
    @program.uniforms.uPMatrix.setf @proj-matrix
    @program.uniforms.uMVMatrix.setf @view-matrix
    
    for id, entity of @entities
      @renderers[entity.renderer]?.render entity
