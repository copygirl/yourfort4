"use strict";

let { Matrix, Vector } = require("sylvester");

Matrix.Translation = function(...v) {
  if (v[0] instanceof Vector) v = v.elements;
  return new Matrix(
    [[    1,    0,    0, 0 ],
     [    0,    1,    0, 0 ],
     [    0,    0,    1, 0 ],
     [ v[0], v[1], v[2], 1 ]]);
};

Matrix.Scale = function(...v) {
  if (v[0] instanceof Vector) v = v.elements;
  return new Matrix(
    [[ v[0], 0, 0, 0 ],
     [ 0, v[1], 0, 0 ],
     [ 0, 0, v[2], 0 ],
     [ 0, 0, 0, 1 ]]);
};

Matrix.prototype.flatten =
  () => [].concat(...this.elements);

let makeLookAt = exports.makeLookAt = function(eye, center, up) {
  let z = eye.subtract(center).toUnitVector();
  let x = up.cross(z).toUnitVector();
  let y = z.cross(x).toUnitVector();
  
  let m = new Matrix(
    [[ x.i, x.j, x.k, 0 ],
     [ y.i, y.j, y.k, 0 ],
     [ z.i, z.j, z.k, 0 ],
     [   0,   0,   0, 1 ]]);
  
  let t = new Matrix(
    [[ 1, 0, 0, -eye.i ],
     [ 0, 1, 0, -eye.j ],
     [ 0, 0, 1, -eye.k ],
     [ 0, 0, 0,      1 ]]);
  
  return m.x(t);
};

let makeFrustum = exports.makeFrustum = function(left, right, bottom, top, znear, zfar) {
  let X = 2 * znear / (right - left);
  let Y = 2 * znear / (top - bottom);
  let A = (right + left) / (right - left);
  let B = (top + bottom) / (top - bottom);
  let C = -(zfar + znear) / (zfar - znear);
  let D = -2 * zfar * znear / (zfar - znear);
  
  return new Matrix(
    [[ X, 0,  A, 0 ]
     [ 0, Y,  B, 0 ]
     [ 0, 0,  C, D ]
     [ 0, 0, -1, 0 ]]);
};

let makePerspective = exports.makePerspective = function(fovy, aspect, znear, zfar) {
  let ymax = znear * Math.tan(fovy * Math.PI / 360.0);
  let ymin = -ymax;
  let xmin = ymin * aspect;
  let xmax = ymax * aspect;
  return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
};

let makeOrtho = exports.makeOrtho = function(left, right, bottom, top, znear, zfar) {
  let tx = -(right + left) / (right - left);
  let ty = -(top + bottom) / (top - bottom);
  let tz = -(zfar + znear) / (zfar - znear);
  
  return new Matrix(
    [[ 2 / (right - left), 0, 0, 0 ]
     [ 0, 2 / (top - bottom), 0, 0 ]
     [ 0, 0, -2 / (zfar - znear), 0 ]
     [ tx, ty, tz, 1 ]]);
};
