require! {
  "../common/block": Block
  "./network/packetType": PacketType
  "./network/side": Side
}

PacketType.define 0, \login, Side.SERVER,
  [ ]
  (player) !->
    if player.logged-in
      throw new Error "Already logged in"
    player.logged-in = true
    player.main.emit \login, player
    player.send \welcome, id: player.id

PacketType.define 1, \welcome, Side.CLIENT,
  [ id: \uint ]
  (game, { id }) !->
    if game.client.logged-in
      throw new Error "Already logged in"
    game.client.own-id = id
    game.client.emit \login

PacketType.define 2, \spawn, Side.CLIENT,
  * * id: \uint
    * type: \ushort
    * x: \int
    * y: \int
  (game, { id, type, x, y }) !->
    if game.client.tracking[id]?
      throw new Error "Spawned entity '#id' multiple times"
    game.add new Block! <<< network-id: id, pos: [x, y]

PacketType.define 3, \despawn, Side.CLIENT,
  [ id: \uint ]
  (game, { id }) !->
    if !(entity = game.client.tracking[id])?
      throw new Error "Despawning unknown entity '#id'"
    game.remove entity
