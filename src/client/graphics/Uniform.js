"use strict";

let { Vector, Matrix } = require("../../common/veccy");

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
    
    if ((values.length == 1) && (typeof values[0] != "number"))
      values = values[0];
    if (values instanceof Vector)
      values = values.elements;
    if (values instanceof Matrix) {
      if ((values.columns != values.rows) || (values.columns > 4))
        throw new Error(`Invalid matrix size (${ columns },${ rows })`);
      GL[`uniformMatrix${ values.columns }fv`](
        this.handle, false, values.elements);
      return;
    }
    
    GL[`uniform${ values.length }fv`](this.handle, values);
  }
  
  seti(...values) {
    const GL = this.program.graphics.gl;
    
    if ((values.length == 1) && (typeof values[0] != "number"))
      values = values[0];
    
    GL[`uniform${ values.length }iv`](this.handle, values);
  }
  
};
