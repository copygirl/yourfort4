require! "./graphics": { Shader, Texture }

resource-handlers =
  
  sprites: (game, name, folder, callback) !->
    image = new Image!
    image.name = name
    image.add-event-listener \error, !->
      callback new Error "Error loading sprite '#name'"
    image.add-event-listener \load, !->
      image.texture = new Texture game.graphics, image
      callback null, image
    image.src = "#folder/#name.png"
  
  shaders: (game, name, folder, callback) !->
    (err, src) <-! load-file "#folder/#name"
    if !err? then try shader = new Shader game.graphics, name, src catch err
    callback err, shader


load-file = (url, callback) !->
  request = new XMLHttpRequest!
  request.open \GET, url
  request.override-mime-type "text/plain"
  request.add-event-listener \loadend, !->
    if request.response-text?
      callback null, request.response-text
    else callback new Error "Error loading '#url'"
  request.send!

assets = null
load-assets = (callback) !->
  if assets? then return callback null, assets
  (err, json) <-! load-file "assets/assets.json"
  callback err, if !err? then JSON.parse json


module.exports = class Assets
  (@game) ->
  
  load: (group, callback, progress) !->
    (err, assets) <~! load-assets
    assets = assets[group]
    
    num-assets = 0
    num-assets-completed = 0
    
    for let type, handler of resource-handlers
      folder = "assets/#type"
      assets-group = @[type] = { }
      
      for let name in assets[type] ? [ ]
        num-assets++
        
        (err, asset) <-! handler game, name, folder
        if err? then console.error err
        else assets-group[name] = asset
        num-assets-completed++
        
        if progress?
          progress asset, num-assets-completed, num-assets
        if num-assets-completed >= num-assets
          callback!
    
    if num-assets <= 0
      callback!
