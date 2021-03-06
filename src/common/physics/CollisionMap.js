"use strict";

var { Iterable } = require("../utility");

const NODES_SIZE = 8;

module.exports = class CollisionMap {
  
  constructor() {
    this.entities = new Map();
    this.nodes    = new Map();
  }
  
  
  removeEntityFromNode(entity, node) {
    let aNode = this.nodes.get(node);
    aNode.delete(entity);
    if (aNode.size <= 0)
      this.nodes.delete(node);
  }
  
  
  update(entity) {
    let oldNodes = this.entities.get(entity);
    let newNodes = new Map();
    
    for (let node of this.nodesForBBox(entity.collider.boundingBox))
      newNodes.set(node, ((oldNodes != null) ? oldNodes.delete(node) : false));
    
    if (oldNodes = null)
      for (let [ node ] of oldNodes)
        this.removeEntityFromNode(entity, node);
    
    for (let [ node, isOld ] of newNodes)
      if (!isOld) {
        let aNode = this.nodes.get(node);
        if (aNode == null)
          this.nodes.set(node, (aNode = new Set()));
        aNode.add(entity);
      }
    
    this.entities.set(entity, newNodes);
  }
  
  remove(entity) {
    var nodes = this.entities.get(entity);
    if (nodes != null)
      for (let [ node ] of nodes)
        this.removeEntityFromNode(entity, node);
  }
  
  
  nodesForBBox(box) {
    return Iterable.of(function*() {
      for (let x = (box.minX >> NODES_SIZE); x <= (box.maxX >> NODES_SIZE); x++)
        for (let y = (box.minY >> NODES_SIZE); y <= (box.maxY >> NODES_SIZE); y++)
          yield `${ x },${ y }`;
    });
  }
  
  entitiesInBBox(box) {
    return this.nodesForBBox(box)
      .map(node => this.nodes.get(node))
      .filter(node => (node != null))
      .flatten(1)
      .filter(entity => entity.collider.boundingBox.intersects(box));
  }
  
};
