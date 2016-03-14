"use strict";

let Buffer = require("../Buffer");
let { map }    = require("../../../common/utility");
let { Matrix } = require("../../../common/veccy");

module.exports = class SpriteRenderer {
  
  constructor(graphics) {
    this.graphics = graphics;
    
    this.vertices = new Buffer(this.graphics,
      [ [ -0.5, -0.5,  0.0 ],
        [  0.5, -0.5,  0.0 ],
        [ -0.5,  0.5,  0.0 ],
        [  0.5,  0.5,  0.0 ] ]);
    
    this.texCoords = new Buffer(this.graphics,
      [ [ 0.0, 0.0 ],
        [ 1.0, 0.0 ],
        [ 0.0, 1.0 ],
        [ 1.0, 1.0 ] ]);
  }
  
  render(entity) {
    const GFX = this.graphics;
    const GL  = GFX.gl;
    
    let sprite = GFX.game.assets.sprites[entity.sprite]
    if ((sprite == null) || (sprite.texture == null)) return;
    
    GFX.push();
    
    let scale     = Matrix.scale(...entity.size, 1);
    let translate = Matrix.translation(...map(entity.pos, Math.round), 0);
    
    GFX.viewMatrix = GFX.viewMatrix.multiply(scale).multiply(translate);
    GFX.program.uniforms.uMVMatrix.setf(GFX.viewMatrix);
    
    GFX.program.uniforms.uColor.setf(entity.color);
    sprite.texture.bind();
    GFX.program.uniforms.uSampler.seti(0);
    
    GFX.program.attributes.aVertexPosition.bind(this.vertices);
    GFX.program.attributes.aTextureCoord.bind(this.texCoords);
    
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    
    GFX.pop();
  }
  
}
