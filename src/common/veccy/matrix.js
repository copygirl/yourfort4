let { type, rangeCheck, repeat } = require("../utility");


module.exports = class Matrix {
  
  constructor(columns, rows, data) {
    this.columns = columns;
    this.rows    = rows;
    this.data    = data;
  }
  
  static create(m) {
    let columns = null;
    let rows = 0;
    let data = [ ];
    for (let row of m) {
      let rowLength = 0;
      for (let element of row) {
        if (typeof element != "number")
          throw new Error(`Expected number, got '${ type(element) }'`)
        data.push(element);
        rowLength++;
      }
      if (columns == null) columns = rowLength;
      else if (rowLength != columns)
        throw new Error(`Row lengths don't match (${ rowLength } != ${ columns })`);
      rows++;
    }
    if ((rows == 0) || (columns == 0))
      throw new Error("Matrix must have at least one element");
    return new Matrix(columns, rows, data);
  }
  
  static zero(columns, rows = columns) {
    if ((columns <= 0) || (rows <= 0))
      throw new Error(`Invalid matrix dimensions (${ columns },${ rows })`);
    let data = new Array(columns * rows);
    return new Matrix(columns, rows, data);
  }
  
  static identity(size) {
    let matrix = Matrix.zero(size);
    for (let i = 0; i < size; i++)
      matrix.set(i, i, 1);
    return matrix;
  }
  
  
  static translation(...v) {
    let matrix = Matrix.identity(v.length - 1);
    for (let i = 0; i < v.length; i++)
      matrix.set(i, matrix.rows - 1, v[i]);
    return matrix;
  }
  
  static scale(...v) {
    let matrix = Matrix.identity(v.length - 1);
    for (let i = 0; i < v.length; i++)
      matrix.set(i, i, v[i]);
    return matrix;
  }
  
  
  static lookAt(eye, center, up) {
    let z = eye.subtract(center).toUnitVector();
    let x = up.cross(z).toUnitVector();
    let y = z.cross(x).toUnitVector();
    
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
      [[ X, 0,  A, 0 ]
       [ 0, Y,  B, 0 ]
       [ 0, 0,  C, D ]
       [ 0, 0, -1, 0 ]]);
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
      [[ 2 / (right - left), 0, 0, 0 ]
      [ 0, 2 / (top - bottom), 0, 0 ]
      [ 0, 0, -2 / (zfar - znear), 0 ]
      [ tx, ty, tz, 1 ]]);
  };
  
  
  get size() { return [ this.columns, this.rows ]; }
  
  get elements() { return this.elements[Symbol.iterator]; }
  
  
  _index(i, j) { return (i + j * this.columns); }
  
  _indexWithCheck(i, j) {
    if (!rangeCheck(i, 0, this.rows - 1) ||
        !rangeCheck(j, 0, this.columns - 1))
      throw new Error(`[${ i },${ j }] is not a valid index in Matrix of size (${ this.size.join(",") })`);
    return this._index(i, j);
  }
  
  get(i, j) { return this.data[this._indexWithCheck(i, j)]; }
  
  set(i, j, v) { this.data[this._indexWithCheck(i, j)] = v; }
  
  
  * row(row) {
    if (!rangeCheck(row, 0, this.rows - 1))
      throw new Error(`Row ${ row } is not valid in Matrix of size (${ this.size.join(",") })`);
    for (let i = 0; i < this.columns; i++)
      yield this.data[this._index(i, row)];
  }
  
  * column(column) {
    if (!rangeCheck(column, 0, this.columns - 1))
      throw new Error(`Column ${ column } is not valid in Matrix of size (${ this.size.join(",") })`);
    for (let i = 0; i < this.rows; i++)
      yield this.data[this._index(column, i)];
  }
  
  setRow(row, ...v) {
    if (!rangeCheck(row, 0, this.rows - 1))
      throw new Error(`Row ${ row } is not valid in Matrix of size (${ this.size.join(",") })`);
    if (v.length > this.columns)
      throw new Error(`Can't put ${ v.length } values into a matrix with ${ this.columns } columns`);
    for (let i = 0; i < this.columns; i++)
      this.data[this._index(i, row)] = v[i];
  }
  
  setColumn(column, ...v) {
    if (!rangeCheck(column, 0, this.columns - 1))
      throw new Error(`Columns ${ column } is not valid in Matrix of size (${ this.size.join(",") })`);
    if (v.length > this.rows)
      throw new Error(`Can't put ${ v.length } values into a matrix with ${ this.rows } rows`);
    for (let i = 0; i < this.rows; i++)
      this.data[this._index(column, i)] = v[i];
  }
  
  
  clone() { return new Matrix(this.columns, this.rows, this.data.slice(0)); }
  
};
