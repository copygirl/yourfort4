"use strict";

exports.map = function* map(iterable, func) {
  for (let element of iterable)
    yield func(element);
}
