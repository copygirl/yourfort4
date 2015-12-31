module.exports = Side =
  NONE: 0
  CLIENT: 1
  SERVER: 2
  BOTH: 3
  
  detect: (main) ->
    switch typeof! main
      | \Game   => Side.CLIENT
      | \Server => Side.SERVER
      | _ => throw new Error "Couldn't detect side for '#that'"
  
  to-string: (side) ->
    | 0 => \NONE
    | 1 => \SERVER
    | 2 => \CLIENT
    | 3 => \BOTH
    | _ => throw new Error "Invalid side '#side'"
