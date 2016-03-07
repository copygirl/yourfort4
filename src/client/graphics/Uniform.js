"use strict";

let { Matrix, Vector } = require("sylvester");

module.exports = class Uniform {
  
  constructor(program, name) {
    const GL = program.graphics.gl;
    
    this.program = program;
    this.name    = name;
    this.handle  = GL.getUniformLocation(program.handle, name);
    this.value   = null;
    
    program.uniforms[name] = this;
  }
  
  setf(...values) {
    const GL = this.program.graphics.gl;
    
    if (values[0] instanceof Matrix) {
      this.value = values[0];
      GL[`uniformMatrix${ this.value.elements.length }fv`](
        this.handle, false, ...[].concat(...this.value.elements));
      return;
    }
    
    this.value = ((values[0] instanceof Vector) ? values[0].elements : values);
    GL[`uniform${ this.value.length }fv`](this.handle, ...this.value);
  }
  
  seti(...values) {
    const GL = this.program.graphics.gl;
    
    this.value = ((values[0] instanceof Vector) ? values[0].elements : values);
    GL[`uniform${ this.value.length }iv`](this.handle, ...this.value);
  }
  
};
