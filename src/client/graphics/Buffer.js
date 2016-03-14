"use strict";

let { type, flatten } = require("../../common/utility");

let typedArrayLookup = {
  BYTE: Int8Array,
  UNSIGNED_BYTE: Uint8Array,
  SHORT: Int16Array,
  UNSIGNED_SHORT: Uint16Array,
  INT: Int32Array,
  UNSIGNED_INT: Uint32Array,
  FLOAT: Float32Array,
  DOUBLE: Float64Array
};

module.exports = class Buffer {
  
  constructor(graphics, type, data, hint, pointerSize, pointerType) {
    const GL = graphics.gl;
    
    if (type instanceof Array)
      [ pointerType, pointerSize, hint, data, type ] =
        [ pointerSize, hint, data, type, GL.ARRAY_BUFFER ];
    
    this.graphics = graphics;
    this.type     = type;
    this.handle   = GL.createBuffer();
    if (data != null)
      this.data(data, hint, pointerSize, pointerType);
  }
  
  bind() {
    this.graphics.gl.bindBuffer(this.type, this.handle);
  }
  
  unbind() {
    this.graphics.gl.bindBuffer(this.type, null);
  }
  
  data(data, hint, pointerSize, pointerType) {
    const GL = this.graphics.gl;
    
    if (hint == null) hint = GL.STATIC_DRAW;
    
    if (data instanceof Array) {
      if (pointerType == null)
        pointerType = ((this.type == GL.ELEMENT_ARRAY_BUFFER) ? GL.UNSIGNED_SHORT : GL.FLOAT);
      if (pointerSize == null)
        pointerSize = ((data[0] instanceof Array) ? data[0].length : 1);
      data = flatten(data);
      
      for (let pt in typedArrayLookup)
        if (pointerType == GL[pt]) {
          data = new typedArrayLookup[pt](data);
          break;
        }
      if (data instanceof Array) // If data is unchanged.
        throw new Error("Unsupported pointer type");
    } else {
      if (data != null)
        for (let pt in typedArrayLookup)
          if (typedArrayLookup[pt] == data.constuctor) {
            pointerType = GL[pt];
            break;
          }
      if (pointerType == null)
        throw new Error(`Expected data to be TypedArray or Array, got '${ type(data) }'`);
    }
    
    this.pointerSize = pointerSize;
    this.pointerType = pointerType;
    
    this.bind();
    GL.bufferData(this.type, data, hint);
  }
  
};
