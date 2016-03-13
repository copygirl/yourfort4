"use strict";

let iterable = require("./iterable");

// Extends the target object with all properties of the source objects.
let extend = exports.extend = function(target, ...sources) {
  for (let source of sources) {
    let properties = iterable.concat(
      Object.getOwnPropertyNames(source),
      Object.getOwnPropertySymbols(source));
    for (let property of properties) {
      let descriptor = Object.getOwnPropertyDescriptor(source, property);
      if (descriptor != null) {
        // If it's a data descriptor (not getter/setter), just set
        // the value normally, causing existing setters to be used.
        if (descriptor.value) target[property] = descriptor.value;
        // Otherwise, properly copy getters/setters over, instead of calling them.
        else Object.defineProperty(target, property, descriptor);
      }
    }
  }
  return target;
};

exports.implement = function(targetClass, ...mixins) {
  extend(targetClass.prototype, ...iterable.map(mixins,
    // If mixin is a function, it's likely a class
    // constructor, so use its prototype instead.
    e => ((typeof e == "function") ? e.prototype : e)));
  return targetClass;
};

// Flattens an iterable object into an array recursively.
exports.flatten = function flatten(obj, array = [ ]) {
  if (iterable.isIterable(obj))
    for (let element of obj)
      flatten(element, array);
  else array.push(obj);
  return array;
};

// Returns a string representation of an object's type,
// for example "Number", Array", "Function", "Block", ...
exports.type = function(obj) {
  if (obj === undefined) return "Undefined";
  if (obj === null) return "Null";
  return Object.prototype.toString.call(obj).slice(8, -1);
};

exports.rangeCheck = function(value, min, max) {
  return ((typeof value == "number") && (value >= min) && (value <= max));
};

extend(exports, iterable);
