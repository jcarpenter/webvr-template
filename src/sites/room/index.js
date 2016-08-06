"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var group;

function Room() {
  this.init();
}

Room.prototype.init = function() {
  
  group = new THREE.Group();
  var background = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1000, 64, 64),
    new THREE.MeshBasicMaterial({ 
      side: THREE.BackSide,
      shading: THREE.FlatShading,
      map: new THREE.TextureLoader().load( 'img/room-1.png')
    })
  )
  group.rotation.set(0, 3.14, 0)
  group.add(background);
}

Room.prototype.show = function() {
  
}

Room.prototype.getObject = function() {
  return group;
}

module.exports = Room;