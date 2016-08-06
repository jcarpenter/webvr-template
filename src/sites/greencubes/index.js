"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var group;

function Greencubes() {
  this.init();
}

Greencubes.prototype.init = function() {
  group = new THREE.Group();
  var background = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1000, 64, 64),
    new THREE.MeshBasicMaterial({ 
      side: THREE.BackSide,
      shading: THREE.FlatShading,
      map: new THREE.TextureLoader().load( 'img/greencubes.png')
    })
  )
  group.rotation.set(0, 3.14, 0)
  group.add(background);
}

Greencubes.prototype.show = function() {
  console.log("show greencubes");
}

Greencubes.prototype.getObject = function() {
  return group;
}

module.exports = Greencubes;