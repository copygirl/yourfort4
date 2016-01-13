module.exports = class Attribute
  (@program, @name) ->
    gl = @program.graphics.gl
    @program.attributes[@name] = this
    @handle = gl.get-attrib-location @program.handle, @name
    gl.enable-vertex-attrib-array @handle
  
  pointer: (size, type, normalize = false, stride = 0, offset = 0) !->
    gl = @program.graphics.gl
    gl.vertex-attrib-pointer @handle, size, type, normalize, stride, offset
  
  bind: (buffer) ->
    buffer.bind!
    @pointer buffer.pointer-size, buffer.pointer-type
