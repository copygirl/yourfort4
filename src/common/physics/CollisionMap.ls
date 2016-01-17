NODES_SIZE = 8


module.exports = class CollisionMap
  ->
    @entities = { }
    @nodes = { }
  
  
  remove-entity-from-node: (entity, node) !->
    delete @nodes[node][entity.id]
    for _ of @nodes[node] then
    else delete @nodes[node]
  
  
  update: (entity) !->
    old-nodes = @entities[entity.id] ? { }
    new-nodes = { }
    
    for node in @nodes-for-bbox entity.collider.bounding-box
      if new-nodes[node] = old-nodes[node]? then
        delete old-nodes[node]
    
    for node of old-nodes
      @remove-entity-from-node entity, node
    
    for node, is-old of new-nodes
      if !is-old
        @nodes{}[node][entity.id] = entity
    
    @entities[entity.id] = new-nodes
  
  remove: (entity) !->
    if (nodes = delete @entities[entity.id])?
      for node in nodes
        @remove-entity-from-node entity, node
  
  
  nodes-for-bbox: (box) ->
    nodes = [ ]
    for x from box.left .>>. NODES_SIZE to box.right .>>. NODES_SIZE
      for y from box.top .>>. NODES_SIZE to box.bottom .>>. NODES_SIZE
        nodes.push "#x,#y"
    nodes
  
  entities-in-bbox: (box, solid-only = false) ->
    entities = { }
    for node in @nodes-for-bbox box
      if (node = @nodes[node])?
        for _, entity of node
          if (!solid-only || entity.solid) &&
             box.intersects entity.collider.bounding-box
            entities[entity.id] = entity
    entities
