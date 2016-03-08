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


exports.zip = function* zip(first, second, func) {
  while (true) {
    let { value: element1, done: done1 } = first.next();
    let { value: element2, done: done2 } = second.next();
    if (done1 || done2) break;
    yield func(element1, element2);
  }
};


exports.all = function all(iterable, func) {
  for (let element of iterable)
    if (!func(element)) return false;
  return true;
};

exports.any = function any(iterable, func = null) {
  for (let element of iterable)
    if ((func == null) || func(element)) return true;
  return false;
};

exports.aggregate = function aggregate(iterable, func, value) {
  let ignoreFirst = (value == undefined);
  for (let element of iterable)
    value = (ignoreFirst ? (ignoreFirst = false, element)
                         : func(value, element));
  return value;
};


exports.take = function* take(iterable, count) {
  if (count > 0)
    for (let element of iterable) {
      yield element;
      if (--count <= 0) break;
    }
};

exports.skip = function* skip(iterable, count) {
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
