require! {
  sylvester: { Matrix }
  "../Buffer"
}

module.exports = class SpriteRenderer
  (@graphics) ->
    @vertices = new Buffer @graphics,
      [[ -0.5, -0.5, 0.0 ]
       [  0.5, -0.5, 0.0 ]
       [ -0.5,  0.5, 0.0 ]
       [  0.5,  0.5, 0.0 ]]
    @tex-coords = new Buffer @graphics,
      [[ 0.0, 0.0 ]
       [ 1.0, 0.0 ]
       [ 0.0, 1.0 ]
       [ 1.0, 1.0 ]]
  
  render: (entity) !->
    gl = @graphics.gl
    
    sprite = @graphics.game.assets.sprites[entity.sprite]
    if !sprite?.texture? then return
    
    @graphics.push!
    
    scale = Matrix.Scale [ ...entity.size, 1 ]
    translate = Matrix.Translation [ ...entity.pos, 0 ]
    @graphics.view-matrix .= x scale .x translate
    @graphics.program.uniforms.uMVMatrix.setf @graphics.view-matrix
    
    @graphics.program.uniforms.uColor.setf entity.color
    sprite.texture.bind!
    @graphics.program.uniforms.uSampler.seti 0
    
    
    @graphics.program.attributes.aVertexPosition.bind @vertices
    @graphics.program.attributes.aTextureCoord.bind @tex-coords
    
    gl.draw-arrays gl.TRIANGLE_STRIP, 0, 4
    
    @graphics.pop!
