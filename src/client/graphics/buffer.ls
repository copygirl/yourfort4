module.exports = class Buffer
  (@graphics, @type, data, hint, pointer-size, pointer-type) ->
    gl = @graphics.gl
    
    if @type.length?
      pointer-type = pointer-size
      pointer-size = hint
      hint = data
      data = @type
      @type = gl.ARRAY_BUFFER
    
    @handle = gl.create-buffer!
    if data? then @data data, hint, pointer-size, pointer-type
  
  bind: !->
    gl = @graphics.gl
    gl.bind-buffer @type, @handle
  
  unbind: !->
    gl = @graphics.gl
    gl.bind-buffer @type, null
  
  data: (data, hint, @pointer-size, @pointer-type) !->
    gl = @graphics.gl
    hint ?= gl.STATIC_DRAW
    
    if data:: == Int8Array::
      @pointer-type = switch typeof! data
        | \Int8Array    => gl.BYTE
        | \Uint8Array, \Uint8ClampedArray => gl.UNSIGNED_BYTE
        | \Int16Array   => gl.SHORT
        | \Uint16Array  => gl.UNSIGNED_SHORT
        | \Int32Array   => gl.INT
        | \Uint32Array  => gl.UNSIGNED_INT
        | \Float32Array => gl.FLOAT
        | \Float64Array => gl.DOUBLE
        | otherwise => throw new Error "Unspported TypedArray type '#{ typeof! data }'"
    
    else if data instanceof Array
      @pointer-type ?= if @type == gl.ELEMENT_ARRAY_BUFFER
        then gl.UNSIGNED_SHORT else gl.FLOAT
      
      size = 1
      while data[0] instanceof Array
        size *= data[0].length
        data = [].concat ...data
      if data[0]?.elements?
        size *= data[0].elements.length
        data = [..flatten! for data]
      @pointer-size ?= size
      
      data = switch @pointer-type
        | gl.BYTE           => new Int8Array data
        | gl.UNSIGNED_BYTE  => new Uint8Array data
        | gl.SHORT          => new Int16Array data
        | gl.UNSIGNED_SHORT => new Uint16Array data
        | gl.INT            => new Int32Array data
        | gl.UNSIGNED_INT   => new Uint32Array data
        | gl.FLOAT          => new Float32Array data
        | gl.DOUBLE         => new Float64Array data
        | otherwise => throw new Error "Unsupported pointer type"
    
    else throw new Error "Expected data to be TypedArray or Array, got '#{ typeof! data }'"
    
    @bind!
    gl.buffer-data @type, data, hint
