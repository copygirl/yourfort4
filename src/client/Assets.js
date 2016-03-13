"use strict";

let { Shader, Texture } = require("./graphics"); 

let loadFile = (url) =>
  new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.overrideMimeType("text/plain");
    request.addEventListener("loadend", () => {
      if (request.responseText != null)
        resolve(request.responseText);
      else reject(new Error(`Error loading asset '${ url }'`));
    });
    request.send();
  });


let resourceHandlers = {
  sprites: (game, name, folder) =>
    new Promise((resolve, reject) => {
      let image = new Image();
      image.name = name;
      image.addEventListener("error", () => {
        reject(new Error(`Error loading sprite '${ name }'`)); });
      image.addEventListener("load", () => {
        image.texture = new Texture(game.graphics, image);
        resolve(image); });
      image.src = `${ folder }/${ name }.png`;
      return image;
    }),
  shaders: (game, name, folder) =>
    loadFile(`${ folder }/${ name }`)
      .then(src => new Shader(game.graphics, name, src))
};

let assetsPromise = loadFile("assets/assets.json")
  .then(str => JSON.parse(str));


module.exports = class Assets {
  
  constructor(game) {
    this.game = game;
  }
  
  load(group, done, progress) {
    assetsPromise.then(assets => {
      assets = assets[group];
      
      let numAssets = 0;
      let numAssetsCompleted = 0;
      
      for (let type in resourceHandlers) {
        let handler = resourceHandlers[type];
        let folder  = `assets/${ type }`;
        let group   = this[type] = { };
        
        if (assets[type] != null)
          for (let name of assets[type]) {
            numAssets++;
            handler(this.game, name, folder)
              .then(asset => {
                group[asset.name] = asset;
                numAssetsCompleted++;
                if (progress != null)
                  progress(asset, numAssetsCompleted + 1, numAssets);
                if (numAssetsCompleted >= numAssets) done();
              });
          }
      }
      if (numAssets <= 0) done();
    });
  }
  
};
