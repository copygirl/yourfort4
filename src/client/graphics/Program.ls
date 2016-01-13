require! {
  "./Uniform"
  "./Attribute"
}

module.exports = class Program
  (@graphics, ...shaders) ->
    gl = @graphics.gl
    @handle = gl.create-program!
    
    @uniforms = { }
    @attributes = { }
    
    for shader in shaders
      gl.attach-shader @handle, shader.handle
    
    gl.link-program @handle
    @info = gl.get-program-info-log @handle
    
    if !gl.get-program-parameter @handle, gl.LINK_STATUS
      throw new Error "Error linking shader program: #{@info}"
  
  use: !->
    gl = @graphics.gl
    gl.use-program @handle
  
  uniform: (name) !->
    new Uniform this, name
  
  attribute: (name) !->
    new Attribute this, name
