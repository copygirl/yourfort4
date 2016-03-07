"use strict";

module.exports = class Texture {
  
  constructor(graphics, image) {
    const GL = graphics.gl;
    
    this.graphics = graphics;
    this.image    = image;
    
    this.handle = GL.createTexture();
    this.bind();
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    this.unbind();
  }
  
  bind() {
    const GL = this.graphics.gl;
    GL.bindTexture(GL.TEXTURE_2D, this.handle);
  }
  
  unbind() {
    const GL = this.graphics.gl;
    GL.bindTexture(GL.TEXTURE_2D, null);
  }
  
};
