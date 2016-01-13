require! sylvester: { Matrix, Vector }

module.exports = class Uniform
  (@program, @name) ->
    gl = @program.graphics.gl
    @program.uniforms[@name] = this
    @handle = gl.get-uniform-location @program.handle, @name
    @value = null
  
  setf: (@value) ->
    gl = @program.graphics.gl
    if @value instanceof Matrix
      func = switch @value.elements.length
        | 1 => gl~uniform-matrix1fv
        | 2 => gl~uniform-matrix2fv
        | 3 => gl~uniform-matrix3fv
        | 4 => gl~uniform-matrix4fv
        | otherwise => throw new Error "Invalid matrix"
      func @handle, false, new Float32Array @value.flatten!
      return
    
    if arguments.length > 1 then @value = arguments
    if @value instanceof Vector then @value = @value.elements
    if typeof! @value == "Number" then @value = [ @value ]
    
    func = switch @value.length
      | 1 => gl~uniform1fv
      | 2 => gl~uniform2fv
      | 3 => gl~uniform3fv
      | 4 => gl~uniform4fv
      | otherwise => throw new Error "Invalid number of elements"
    func @handle, new Float32Array @value
  
  seti: (@value) ->
    gl = @program.graphics.gl
    if arguments.length > 1 then @value = arguments
    if @value instanceof Vector then @value = @value.elements
    if typeof! @value == "Number" then @value = [ @value ]
    
    func = switch @value.length
      | 1 => gl~uniform1iv
      | 2 => gl~uniform2iv
      | 3 => gl~uniform3iv
      | 4 => gl~uniform4iv
      | otherwise => throw new Error "Invalid number of elements"
    func @handle, new Float32Array @value
