"use strict";

let Uniform = require("./Uniform");
let Attribute = require("./Attribute");

module.exports = class Program {
  
  constructor(graphics, ...shaders) {
    const GL = graphics.gl;
    
    this.graphics = graphics;
    this.handle   = GL.createProgram();
    
    this.uniforms   = { };
    this.attributes = { };
    
    for (let shader of shaders)
      GL.attachShader(this.handle, shader.handle);
    
    GL.linkProgram(this.handle);
    this.info = GL.getProgramInfoLog(this.handle);
    
    if (!GL.getProgramParameter(this.handle, GL.LINK_STATUS))
      throw new Error(`Error linking shader program: ${ this.info }`);
  }
  
  use() {
    const GL = this.graphics.gl;
    GL.useProgram(this.handle);
  }
  
  uniform(name) {
    return new Uniform(this, name);
  }
  
  attribute(name) {
    return new Attribute(this, name);
  }
  
};
