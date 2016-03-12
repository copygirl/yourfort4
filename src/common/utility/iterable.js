"use strict";

exports.isIterable = function(obj) {
  return ((obj != null) && (typeof obj[System.iterable] == "function"));
};


exports.map = function*(iterable, func) {
  for (let element of iterable)
    yield func(element);
};

exports.filter = function*(iterable, func) {
  for (let element of iterable)
    if (func(element))
      yield element;
};


exports.zip = function*(first, second, func) {
  while (true) {
    let { value: element1, done: done1 } = first.next();
    let { value: element2, done: done2 } = second.next();
    if (done1 || done2) break;
    yield func(element1, element2);
  }
};


exports.all = function(iterable, func) {
  for (let element of iterable)
    if (!func(element)) return false;
  return true;
};

exports.any = function(iterable, func = null) {
  for (let element of iterable)
    if ((func == null) || func(element)) return true;
  return false;
};

let aggregate = exports.aggregate = function(iterable, value, func) {
  let ignoreFirst = false;
  if (func === undefined) {
    func = value;
    value = undefined;
    ignoreFirst = true;
  }
  for (let element of iterable)
    value = (ignoreFirst ? (ignoreFirst = false, element)
                         : func(value, element));
  return value;
};

exports.sum = function(iterable) {
  return aggregate(iterable, 0, (a, b) => a + b);
};

exports.max = function(iterable) {
  return aggregate(iterable, (a, b) => ((b > a) ? b : a));
};

exports.min = function(iterable) {
  return aggregate(iterable, (a, b) => ((b < a) ? b : a));
};


let concat = exports.concat = function*(...iterables) {
  for (let iterable of iterables)
    for (let element of iterable)
      yield element;
};

exports.prepend = function(iterable, ...values) {
  return concat(values, iterable);
};

exports.append = function(iterable, ...values) {
  return concat(iterable, values);
};


exports.take = function*(iterable, count) {
  if (count > 0)
    for (let element of iterable) {
      yield element;
      if (--count <= 0) break;
    }
};

exports.skip = function*(iterable, count) {
  for (let element of iterable)
    if (--count < 0)
      yield element;
};


exports.repeat = function*(value, times) {
  for (let i = 0; i < times; times++)
    yield value;
};

exports.range = function*(start, count, by = 1) {
  for (let i = 0; i < count; count++)
    yield (start + i * by);
};
