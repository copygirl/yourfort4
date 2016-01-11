require! { fs, child_process }

run = (command) ->
  (resolve, reject) <-! new Promise!
  (err, stdout, stderr) <-! child_process.exec command
  if err then reject new Error stderr
  resolve stdout

do
  console.log "Compiling LiveScript ..."
  run "lsc -co lib src"
.then ->
  console.log "Browserifying game.js ..."
  run "browserify --ignore lapack lib/client/game.js > public/game.js"
.catch (err) !->
  console.error err.message
  process.exit 1
