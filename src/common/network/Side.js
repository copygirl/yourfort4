"use strict";

let Side = module.exports = {
  
  NONE: 0,
  CLIENT: 1,
  SERVER: 2,
  BOTH: 3,
  
  invert(side) {
    switch (side) {
      case Side.NONE:
      case Side.BOTH: return side;
      case Side.CLIENT:
      case Side.SERVER: return (side ^ Side.BOTH);
      default: throw new Error(`Invalid side '${ side }'`);
    }
  },
  
  toString(side) {
    switch (side) {
      case Side.NONE:   return "NONE";
      case Side.CLIENT: return "CLIENT";
      case Side.SERVER: return "SERVER";
      case Side.BOTH:   return "BOTH";
      default: throw new Error(`Invalid side '${ side }'`);
    }
  }
  
}
