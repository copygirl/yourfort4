require! sylvester: { Matrix, Vector }

Matrix.Translation = (v) ->
  if arguments.length > 1 then v = arguments
  if v instanceof Vector then v = v.elements
  $M do
    [[ 1 0 0 0 ]
     [ 0 1 0 0 ]
     [ 0 0 1 0 ]
     [ v[0], v[1], v[2], 1 ]]

Matrix.Scale = (v) ->
  if arguments.length > 1 then v = arguments
  if v instanceof Vector then v = v.elements
  $M do
    [[ v[0], 0 0 0 ]
     [ 0 v[1], 0 0 ]
     [ 0 0 v[2], 0 ]
     [ 0 0 0 1 ]]

Matrix::flatten = ->
  [].concat ...@elements

export make-look-at = (eye, center, up) ->
  z = eye.subtract center .to-unit-vector!
  x = up.cross z .to-unit-vector!
  y = z.cross x .to-unit-vector!
  
  m = $M do
    [[ (x.e 1), (x.e 2), (x.e 3), 0 ]
     [ (y.e 1), (y.e 2), (y.e 3), 0 ]
     [ (z.e 1), (z.e 2), (z.e 3), 0 ]
     [ 0 0 0 1 ]]
  
  t = $M do
    [[ 1 0 0 -eye.elements[0] ]
     [ 0 1 0 -eye.elements[1] ]
     [ 0 0 1 -eye.elements[2] ]
     [ 0 0 0 1 ]]
  
  m.x t

export make-perspective = (fovy, aspect, znear, zfar) ->
  ymax = znear * Math.tan fovy * Math.PI / 360.0
  ymin = -ymax
  xmin = ymin * aspect
  xmax = ymax * aspect
  make-frustum xmin, xmax, ymin, ymax, znear, zfar

export make-frustum = (left, right, bottom, top, znear, zfar) ->
  X = 2 * znear / (right - left)
  Y = 2 * znear / (top - bottom)
  A = (right + left) / (right - left)
  B = (top + bottom) / (top - bottom)
  C = -(zfar + znear) / (zfar - znear)
  D = -2 * zfar * znear / (zfar - znear)
  
  $M do
    [[ X, 0,  A, 0 ]
     [ 0, Y,  B, 0 ]
     [ 0, 0,  C, D ]
     [ 0, 0, -1, 0 ]]

export make-ortho = (left, right, bottom, top, znear, zfar) ->
  tx = -(right + left) / (right - left)
  ty = -(top + bottom) / (top - bottom)
  tz = -(zfar + znear) / (zfar - znear)
  
  $M do
    [[ 2 / (right - left), 0, 0, 0 ]
     [ 0, 2 / (top - bottom), 0, 0 ]
     [ 0, 0, -2 / (zfar - znear), 0 ]
     [ tx, ty, tz, 1 ]]
