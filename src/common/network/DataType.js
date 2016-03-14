"use strict";

let { UnexpectedTypeError } = require("../utility");

let DataType = module.exports = class DataType {
  
  // read: (view, index) => [ value, size ]
  // write: (view, index, value) => size
  // size: Number or (value) => size
  // verify: (value) => <throws error if invalid>
  constructor(name, read, write, size, verify) {
    this.name   = name;
    this.read   = read;
    this.write  = write;
    this.size   = size;
    this.verify = verify;
    
    if (name in DataType)
      throw new Error(`Data type '${ name }' already defined`);
    DataType[name] = this;
  }
  
  getSize(value) {
    return ((typeof this.size == "function")
      ? this.size(value) : this.size);
  }
  
  static find(name) { return DataType[name]; }
  
  static findOrThrow(name) {
    let type = DataType.find(name);
    if (type != null) return type;
    else throw new Error(`Unknown data type '${ name }'`);
  }
  
  static define(...args) {
    return new DataType(...args);
  }
  
};


let simple = (access, size, verify) =>
  [ (view, index) => [ view[`get${ access }`](index), size ],
    (view, index, value) => [ view[`set${ access }`](index, value), size ],
    size, verify ];

let checkInt = (min, max) => (value) => {
  if (typeof value != "number")
    throw new UnexpectedTypeError(value, Number);
  if (!Number.isSafeInteger)
    throw new Error(`Number '${ value }' is not an integer`);
  if ((value < min) || (value > max))
    throw new Error(`Integer '${ value }' is not in valid range (${ min } - ${ max })`);
};

let checkIsNumber = (value) => {
  if (typeof value != "number")
    throw new UnexpectedTypeError(value, Number);
};


DataType.define("byte",   ...simple("Uint8",   1, checkInt(    0, 0xFF)));
DataType.define("sbyte",  ...simple("Int8",    1, checkInt(-0x80, 0x7F)));
DataType.define("short",  ...simple("Uint16",  2, checkInt(      0, 0xFFFF)));
DataType.define("ushort", ...simple("Int16",   2, checkInt(-0x8000, 0x7FFF)));
DataType.define("int",    ...simple("Uint32",  4, checkInt(          0, 0xFFFFFFFF)));
DataType.define("uint",   ...simple("Int32",   4, checkInt(-0x80000000, 0x7FFFFFFF)));
DataType.define("float",  ...simple("Float32", 4, checkIsNumber));
DataType.define("double", ...simple("Float64", 8, checkIsNumber));
