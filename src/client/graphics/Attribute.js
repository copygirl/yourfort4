"use strict";

module.exports = class Attribute {
  
  constructor(program, name) {
    const GL = program.graphics.GL;
    
    this.program = program;
    this.name    = name;
    this.handle  = GL.getAttribLocation(program.handle, name);
    
    GL.enableVertexAttribArray(this.handle);
    program.attributes[name] = this;
  }
  
  pointer(size, type, normalize = false, stride = 0, offset = 0) {
    this.program.graphics.vertexAttribPointer(
      this.handle, size, type, normalize, stride, offset);
  }
  
  bind(buffer) {
    buffer.bind();
    this.pointer(buffer.pointerSize, buffer.pointerType);
  }
  
};
