require! { fs, child_process }

run = (command) ->
  (resolve, reject) <-! new Promise!
  (err, stdout, stderr) <-! child_process.exec command
  if err then reject new Error stderr
  resolve stdout

copy = (source, target) ->
  (resolve, reject) <-! new Promise! 
  (err) <-! fs.access source, fs.F_OK .|. fs.R_OK
  if err then return reject err
  rs = fs.create-read-stream source
    ..on \error, reject
  ws = fs.create-write-stream target
    ..on \error, reject
    ..on \finish, resolve
  rs.pipe ws

do
  console.log "Compiling LiveScript ..."
  run "lsc -co lib src"
.then ->
  console.log "Browserifying game.js ..."
  run "browserify --ignore lapack lib/client/game.js > public/game.js"
.then ->
  console.log "Copying worker.js ..."
  copy "lib/client/worker.js", "public/worker.js"
.catch (err) !->
  console.error err.message
  process.exit 1
