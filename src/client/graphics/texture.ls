module.exports = class Texture
  (@graphics, @image) ->
    gl = @graphics.gl
    @handle = gl.create-texture!
    @bind!
    gl.tex-image2D gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image
    gl.tex-parameteri gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST
    gl.tex-parameteri gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST
    gl.tex-parameteri gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE
    gl.tex-parameteri gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE
    @unbind!
  
  bind: !->
    gl = @graphics.gl
    gl.bind-texture gl.TEXTURE_2D, @handle
  
  unbind: !->
    gl = @graphics.gl
    gl.bind-texture gl.TEXTURE_2D, null
