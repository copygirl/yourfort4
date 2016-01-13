module.exports = class Shader
  (@graphics, @name, @src) ->
    gl = @graphics.gl
    ext = (name / ".")[1]
    @type = switch ext
      | "vs" => gl.VERTEX_SHADER
      | "fs" => gl.FRAGMENT_SHADER
    if !@type? then throw new Error "Unknown shader type '#ext'"
    
    @handle = gl.create-shader @type
    gl.shader-source @handle, @src
    gl.compile-shader @handle
    
    @info = gl.get-shader-info-log @handle
    if !gl.get-shader-parameter @handle, gl.COMPILE_STATUS
      throw new Error "Error compiling shader '#{@name}': #{@info}"
