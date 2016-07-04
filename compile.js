"use strict";

let fs = require("fs");
let { exec } = require("child_process");

let run = function(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err != null) reject(new Error(stderr));
      resolve(stdout);
    });
  });
};

let copy = function(source, target) {
  return new Promise((resolve, reject) => {
    fs.access(source, fs.F_OK | fs.R_OK, (err) => {
      if (err != null) reject(err);
      let rs = fs.createReadStream(source);
      rs.on("error", reject);
      let ws = fs.createWriteStream(target);
      ws.on("error", reject);
      ws.on("finish", resolve);
      rs.pipe(ws);
    });
  });
};

console.log("Browserifying game.js ...");
run("browserify --ignore lapack src/client/Game.js > public/game.js")
  .then(() => {
    console.log("Job done!");
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
