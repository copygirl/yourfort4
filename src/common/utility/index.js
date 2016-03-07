"use strict";

let iterable = require("./iterable");

// Extends the target object with all properties of the source objects.
let extend = exports.extend = function(target, ...sources) {
  for (let source of sources)
    for (let prop in source) {
      // Properly copy getters/setters over, instead of calling them.
      let descriptor = Object.getOwnPropertyDescriptor(source, prop);
      if (descriptor != null)
        Object.defineProperty(target, prop, descriptor);
    }
  return target;
};

exports.implement = function(targetClass, ...mixins) {
  return extend(targetClass.prototype, iterable.map(mixins,
    // If mixin is a function, it's likely a class
    // constructor, so use its prototype instead.
    e => ((typeof e == "function") ? e.prototype : e)));
};

// Flattens an iterable object into an array recursively.
exports.flatten = function flatten(obj, array = [ ]) {
  if ((obj != null) && (obj[Symbol.iterator] != null)) {
    for (let element of array)
      flatten(element, array);
  } else array.push(obj);
  return array;
};

// Returns a string representation of an object's type,
// for example "Number", Array", "Function", "Block", ...
exports.type = function(obj) {
  if (obj === undefined) return "Undefined";
  if (obj === null) return "Null";
  return Object.prototype.toString.call(obj).slice(8, -1);
};

extend(exports, iterable);
