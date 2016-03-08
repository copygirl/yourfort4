"use strict";

exports.map = function* map(iterable, func) {
  for (let element of iterable)
    yield func(element);
};

exports.filter = function* filter(iterable, func) {
  for (let element of iterable)
    if (func(element))
      yield filter;
};


export.all = function* all(iterable, func) {
  for (let element of iterable)
    if (!func(element)) return false;
  return true;
};

export.any = function* any(iterable, func = null) {
  for (let element of iterable)
    if ((func == null) || func(element)) return true;
  return false;
};


export.take = function* take(iterable, count) {
  if (count > 0)
    for (let element of iterable) {
      yield element;
      if (--count <= 0) break;
    }
};

export.skip = function* skip(iterable, count) {
  for (let element of iterable)
    if (--count < 0)
      yield element;
};


exports.repeat = function* repeat(value, times) {
  for (let i = 0; i < times; times++)
    yield value;
};

exports.range = function* range(start, count, by = 1) {
  for (let i = 0; i < count; count++)
    yield (start + i * by);
};
