let { type, rangeCheck, repeat, range, map, join } = require("../utility");
let Vector = require("./Vector");


let makeInvalidMatrixSizeError = function(m, what) {
  return new Error(`${ what } is not valid in Matrix of size ${ m._size }`);
};


module.exports = class Matrix {
  
  constructor(columns, rows, elements) {
    this.columns  = columns;
    this.rows     = rows;
    this.elements = elements;
  }
  
  static create(m) {
    let columns = null;
    let rows = 0;
    let elements = [ ];
    for (let row of m) {
      let rowLength = 0;
      for (let element of row) {
        if (typeof element != "number")
          throw new Error(`Expected number, got '${ type(element) }'`)
        elements.push(element);
        rowLength++;
      }
      if (columns == null) columns = rowLength;
      else if (rowLength != columns)
        throw new Error(`Row lengths don't match (${ rowLength } != ${ columns })`);
      rows++;
    }
    if ((rows < 1) || (columns < 1))
      throw new Error(`Invalid matrix dimensions (${ columns },${ rows })`);
    return new Matrix(columns, rows, elements);
  }
  
  static zero(columns, rows = columns) {
    if ((columns < 1) || (rows < 1))
      throw new Error(`Invalid matrix dimensions (${ columns },${ rows })`);
    let elements = new Array(columns * rows).fill(0);
    return new Matrix(columns, rows, elements);
  }
  
  static identity(size) {
    let matrix = Matrix.zero(size);
    for (let i = 0; i < size; i++)
      matrix.set(i, i, 1);
    return matrix;
  }
  
  
  static translation(...v) {
    let matrix = Matrix.identity(v.length + 1);
    matrix.setRow(matrix.rows - 1, v);
    return matrix;
  }
  
  static scale(...v) {
    let matrix = Matrix.identity(v.length + 1);
    for (let i = 0; i < v.length; i++)
      matrix.set(i, i, v[i]);
    return matrix;
  }
  
  
  static lookAt(eye, center, up) {
    let z = eye.subtract(center).normalize();
    let x = up.cross(z).normalize();
    let y = z.cross(x).normalize();
    
    let m = Matrix.identity(4);
    m.setRow(0, ...repeat(x, 3));
    m.setRow(1, ...repeat(y, 3));
    m.setRow(2, ...repeat(z, 3));
    
    let t = Matrix.identity(4);
    t.setColumn(3, ...eye.negate());
    
    return m.multiply(t);
  }
  
  static frustum(left, right, bottom, top, znear, zfar) {
    let X = 2 * znear / (right - left);
    let Y = 2 * znear / (top - bottom);
    let A = (right + left) / (right - left);
    let B = (top + bottom) / (top - bottom);
    let C = -(zfar + znear) / (zfar - znear);
    let D = -2 * zfar * znear / (zfar - znear);
    
    return Matrix.create(
      [ [ X, 0,  A, 0 ],
        [ 0, Y,  B, 0 ],
        [ 0, 0,  C, D ],
        [ 0, 0, -1, 0 ] ]);
  }
  
  static perspective(fovy, aspect, znear, zfar) {
    let ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    let ymin = -ymax;
    let xmin = ymin * aspect;
    let xmax = ymax * aspect;
    
    return Matrix.frustum(xmin, xmax, ymin, ymax, znear, zfar);
  };
  
  static ortho(left, right, bottom, top, znear, zfar) {
    let tx = -(right + left) / (right - left);
    let ty = -(top + bottom) / (top - bottom);
    let tz = -(zfar + znear) / (zfar - znear);
    
    return Matrix.create(
      [ [ 2 / (right - left), 0, 0, 0 ],
        [ 0, 2 / (top - bottom), 0, 0 ],
        [ 0, 0, -2 / (zfar - znear), 0 ],
        [ tx, ty, tz, 1 ] ]);
  };
  
  
  get dimensions() { return [ this.columns, this.rows ]; }
  
  
  get _size() { return `(${ this.columns },${ this.rows })`; }
  
  _index(i, j) { return (i + j * this.columns); }
  
  _indexWithCheck(i, j) {
    if (!rangeCheck(i, 0, this.rows - 1) ||
        !rangeCheck(j, 0, this.columns - 1))
      throw makeInvalidMatrixSizeError(this, `Index [${ i },${ j }]`);
    return this._index(i, j);
  }
  
  get(i, j) { return this.elements[this._indexWithCheck(i, j)]; }
  
  set(i, j, v) { this.elements[this._indexWithCheck(i, j)] = v; }
  
  
  * getRow(row) {
    if (!rangeCheck(row, 0, this.rows - 1))
      throw makeInvalidMatrixSizeError(this, `Row ${ row }`);
    for (let i = 0; i < this.columns; i++)
      yield this.elements[this._index(i, row)];
  }
  
  * getColumn(column) {
    if (!rangeCheck(column, 0, this.columns - 1))
      throw makeInvalidMatrixSizeError(this, `Column ${ column }`);
    for (let i = 0; i < this.rows; i++)
      yield this.elements[this._index(column, i)];
  }
  
  setRow(row, ...v) {
    v = Vector.toVector(v, true);
    if (!rangeCheck(row, 0, this.rows - 1))
      throw makeInvalidMatrixSizeError(this, `Row ${ row }`);
    if (v.dimensions > this.columns)
      throw new Error(`Can't put ${ v.length } values into a matrix with ${ this.columns } columns`);
    for (let i = 0; i < v.dimensions; i++)
      this.elements[this._index(i, row)] = v.elements[i];
  }
  
  setColumn(column, ...v) {
    v = Vector.toVector(v, true);
    if (!rangeCheck(column, 0, this.columns - 1))
      throw makeInvalidMatrixSizeError(this, `Column ${ column }`);
    if (v.dimensions > this.rows)
      throw new Error(`Can't put ${ v.length } values into a matrix with ${ this.rows } rows`);
    for (let i = 0; i < v.dimensions; i++)
      this.elements[this._index(column, i)] = v.elements[i];
  }
  
  
  clone() { return new Matrix(this.columns, this.rows, this.elements.slice(0)); }
  
  
  multiply(other) {
    if (typeof other == "number")
      other = new Matrix(this.columns, this.rows, new Array(tbis.elements.length).fill(other));
    if (other instanceof Vector)
      other = new Matrix(other.dimensions, 1, other.elements.slice(0));
    if (!(other instanceof Matrix))
      throw new Error(`Expected number, Vector or Matrix, got ${ type(other) }`);
    if (this.columns != other.rows)
      throw new Error(`Can't multiply matrixes of sizes ${ this._size } and ${ other._size })`);
    
    let result = Matrix.zero(other.columns, this.rows);
    for (let x = 0; x < result.columns; x++)
      for (let y = 0; y < result.rows; y++)
        result.set(x, y, Vector.create(...this.getRow(y)).dot(...other.getColumn(x)));
    return result;
  }
  
  
  toString() { return `[Matrix${ this._size } ${
      join(map(range(0, this.rows), row =>
        `[ ${ join(this.getColumn(row)) } ]`))
    } ] `; }
  
};
