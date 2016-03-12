"use strict";

let Entity  = require("../../common/Entity");
let Shader  = require("./Shader");
let Program = require("./Program");
let Buffer  = require("./Buffer");

let renderers     = require("./renderers");
let { Matrix }    = require("../../common/veccy");
let { implement } = require("../../common/utility");


let createWebGLContext = function(canvas) {
    let gl = canvas.getContext("webgl");
    if (gl == null) throw Error("Couldn't create WebGL context");
    if (WebGLDebugUtils != null) 
      gl = WebGLDebugUtils.makeDebugContext(gl);
    return gl;
}

implement(Entity, {
  renderer: null,
  sprite:   null,
  color:    [ 1, 1, 1, 1 ]
});


module.exports = class Graphics {
  
  constructor(game, canvas, size = [ 450, 275 ], scale = 2) {
    this.game   = game;
    this.canvas = canvas;
    this.gl     = createWebGLContext(this.canvas);
    
    this.matrixStack = [ ];
    this.projMatrix  = null;
    this.viewMatrix  = Matrix.identity(4);
    this.resize(size, scale);
    
    this.background = [ 0.0675, 0.125, 0.25, 1 ];
    
    this.renderers = {
      sprite: new renderers.Sprite(this)
    };
    
    this.renderable = new Set();
    this.game.on("spawn", (entity) => {
        if (entity.renderer != null)
          this.renderable.add(entity);
      });
    this.game.on("despawn", (entity) => {
        this.renderable.delete(entity);
      });
  }
  
  
  get size() { return [ this.canvas.width, this.canvas.height ]; }
  set size(size) { this.resize(size, this.scale); }
  
  get scale() { return this.canvas.clientWidth / this.canvas.width; }
  set scale(scale) { this.resize(this.size, scale); }
  
  resize(size, scale) {
    let width = this.canvas.width = size[0];
    let height = this.canvas.height = size[1];
    this.canvas.style.width  = `${ width * scale }px`
    this.canvas.style.height = `${ height * scale }px`
    this.gl.viewport(0, 0, width, height);
    this.projMatrix = makeOrtho(0, width, height, 0, -128, 128);
  }
  
  
  init() {
    const GL = this.gl;
    
    GL.enable(gl.BLEND);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.activeTexture(GL.TEXTURE0);
    
    this.program = new Program(this,
      this.game.assets.shaders["default.vs"],
      this.game.assets.shaders["default.fs"]);
    this.program.use();
    
    for (let uniform in [ "uPMatrix", "uMVMatrix", "uColor", "uSampler" ])
      this.program.uniform(uniform);
    for (let attr in [ "aVertexPosition", "aTextureCoord" ])
      this.program.attribute(attr);
    
    requestAnimationFrame(this.render.bind(this));
  }
  
  
  push(matrix = this.viewMatrix.clone()) {
    this.matrixStack.push(this.viewMatrix);
    return this.viewMatrix = matrix;
  }
  
  pop() {
    if (this.matrixStack.length <= 0)
      throw new Error("Attempting to pop empty matrix stack");
    return this.viewMatrix = this.matrixStack.pop();
  }
  
  
  render() {
    const GL = this.gl;
    
    GL.clearColor(...this.background);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    
    this.program.uniforms.uPMatrix.setf(...this.projMatrix.elements);
    this.program.uniforms.uMVMatrix.setf(...this.viewMatrix.elements);
    
    for (let entity in this.renderable) {
      let renderer = this.renderers[entity.renderer];
      if (renderer != null) renderer.render(entity);
    }
    
    if (this.game.input.mouse.inside) {
      this.renderers.sprite.render({
        sprite: "cursor",
        pos:    this.game.input.mouse,
        size:   [ 15, 15 ],
        color:  [ 1, 1, 1, 1 ]
      });
    }
    
    requestAnimationFrame(this.render.bind(this));
  }
  
};
