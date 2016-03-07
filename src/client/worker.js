"use strict";

let intervalId = null;

self.addEventListener("message", ({ data: interval }) => {
  if (interval > 0) {
    intervalId = setInterval(
      () => { self.postMessage(interval); },
      interval);
  } else clearInterval(intervalId);
});
