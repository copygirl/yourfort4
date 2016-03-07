"use strict";

let { Shader, Texture } = require("./graphics"); 

let loadFile = function(url, callback) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.overrideMimeType("text/plain");
  request.addEventListener("loadend", () => {
    if (request.responseText != null)
      callback(null, request.responseText);
    else callback(new Error(`Error loading asset '${ url }'`));
  });
  request.send();
};

let resourceHandlers = {
  sprites: function(game, name, folder, callback) {
    let image = new Image();
    image.name = name;
    image.addEventListener("error", () => {
      callback(new Error(`Error loading sprite '${ name }'`)); });
    image.addEventListener("load", () => {
      image.texture = new Texture(game.graphics, image);
      callback(null, image); });
    image.src = `${ folder }/${ name }.png`;
  },
  shaders: function(game, name, folder, callback) {
    loadFile("#folder/#name", (err, src) => {
      let shader;
      if (err == null) {
        try { shader = new Shader(game.graphics, name, src); }
        catch (e) { err = e; }
      }
      callback(err, shader);
    });
  }
};

let assets = null;
let loadAssets = function(callback) {
  if (assets != null) return callback(null, assets);
  loadFile("assets/assets.json", (err, json) => {
    if (err != null) {
      try { assets = JSON.parse(json); }
      catch (e) { err = e; }
    }
    callback(err, assets); });
};


module.exports = class Assets {
  
  constructor(game) {
    this.game = game;
  }
  
  load(group, callback, progress) {
    loadAssets((err, assets) => {
      assets = assets[group];
      
      let numAssets = 0;
      let numAssetsCompleted = 0;
      
      for (let type in resourceHandlers) {
        let handler = resourceHandlers[type];
        let folder  = `assets/${ type }`;
        let group   = this[type] = { };
        
        if (assets[type] != null)
          for (let name in assets[type]) {
            numAssets++;
            handler(this.game, name, folder, (err, asset) => {
              if (err != null) console.error(err);
              else group[name] = asset;
              numAssetsCompleted++;
              
              if (progress != null)
                progress(asset, numAssetsCompleted, numAssets);
              if (numAssetsCompleted >= numAssets)
                callback();
            });
          }
      }
      
      if (numAssets <= 0)
        callback();
    });
  }
  
};
