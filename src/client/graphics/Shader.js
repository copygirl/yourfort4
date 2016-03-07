"use strict";

module.exports = class Shader {
  
  constructor(graphics, name, src) {
    const GL = graphics.gl;
    
    this.graphics = graphics;
    this.name     = name;
    this.src      = src;
    
    let ext = name.split(".")[1];
    switch (ext) {
      case "vs": this.type = GL.VERTEX_SHADER; break;
      case "fs": this.type = GL.FRAGMENT_SHADER; break;
      default: throw new Error(`Unknown shader type '${ ext }'`); break;
    }
    
    this.handle = GL.createShader(this.type);
    GL.shaderSource(this.handle, this.src);
    GL.compileShader(this.handle);
    
    this.info = GL.getShaderInfoLog(this.handle);
    if (!GL.getShaderParameter(this.handle, Gl.COMPILE_STATUS))
      throw new Error(`Error compiling shader '${ this.name }': ${ this.info }`);
  }
  
};
