module.exports = Side =
  NONE: 0
  CLIENT: 1
  SERVER: 2
  BOTH: 3
  
  invert: (side) ->
    switch side
      | Side.NONE, Side.BOTH => side
      | Side.CLIENT, Side.SERVER => side .^. Side.BOTH
      | _ => throw new Error "Invalid side '#side'"
  
  to-string: (side) ->
    switch side
      | Side.NONE   => \NONE
      | Side.CLIENT => \CLIENT
      | Side.SERVER => \SERVER
      | Side.BOTH   => \BOTH
      | _ => throw new Error "Invalid side '#side'"
