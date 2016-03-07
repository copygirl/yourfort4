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
    
    this.graphics = graphics;
    this.type     = type;
    
    if (type.length != null) {
      pointerType = pointerSize;
      pointerSize = hint;
      hint = data;
      data = type;
      type = GL.ARRAY_BUFFER;
    }
    
    this.handle = GL.createBuffer();
    if (data != null)
      this.data(data, hint, pointerSize, pointerType);
  }
  
  bind() {
    this.graphics.bindBuffer(this.type, this.handle);
  }
  
  unbind() {
    this.graphics.gl.bindBuffer(this.type, null);
  }
  
  data(data, hint, pointerSize, pointerType) {
    const GL = this.graphics.gl;
    
    this.pointerSize = pointerSize;
    this.pointerType = pointerType;
    hint = (hint || GL.STATIC_DRAW);
    
    if (data instanceof Array) {
      if (this.pointerType == null)
        this.pointerType = ((this.type == GL.ELEMENT_ARRAY_BUFFER) ? GL.UNSIGNED_SHORT : GL.FLOAT);
      
      let newData = [ ];
      for (let element of data) {
        // If element is a sylvester data type, get down to its array.
        if (element.elements) element = element.elements;
        flatten(data, newData);
        if (this.pointerSize == null)
          this.pointerSize = newData.length;
      }
      
      for (let pointerType in typedArrayLookup)
        if (this.pointerType == GL[pointerType]) {
          data = new typedArrayLookup[pointerType](data);
          break;
        }
      if (data instanceof Array) // If data is unchanged.
        throw new Error("Unsupported pointer type");
    } else {
      if (data != null)
        for (let pointerType in typedArrayLookup)
          if (typedArrayLookup[pointerType] == data.constuctor) {
            this.pointerType = GL[pointerType];
            break;
          }
      if (this.pointerType == null)
        throw new Error(`Expected data to be TypedArray or Array, got '${ type(data) }'`);
    }
    
    this.bind();
    GL.bufferData(this.type, data, hint);
  }
  
};
