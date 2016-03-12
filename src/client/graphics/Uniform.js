"use strict";

let { Matrix } = require("../../common/veccy");

module.exports = class Uniform {
  
  constructor(program, name) {
    const GL = program.graphics.gl;
    
    this.program = program;
    this.name    = name;
    this.handle  = GL.getUniformLocation(program.handle, name);
    
    program.uniforms[name] = this;
  }
  
  setf(...values) {
    const GL = this.program.graphics.gl;
    
    if (values[0] instanceof Matrix) {
      GL[`uniformMatrix${ values[0].elements.length }fv`](
        this.handle, false, ...values[0].elements);
      return;
    }
    
    GL[`uniform${ values.length }fv`](this.handle, ...values);
  }
  
  seti(...values) {
    const GL = this.program.graphics.gl;
    
    GL[`uniform${ values.length }iv`](this.handle, ...values);
  }
  
};
