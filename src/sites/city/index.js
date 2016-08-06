"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var group;

function City() {
  this.init();
}

City.prototype.init = function() {
  group = new THREE.Group();
  var geometry = new THREE.SphereGeometry(1000, 64, 64);
  geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
  var background = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ 
      shading: THREE.FlatShading,
      map: new THREE.TextureLoader().load( 'img/sites/mountains/mountains.jpg')
    })
  )
  group.add(background);
  group.rotation.set(0,-1.57,0);
}

City.prototype.show = function() {

}

City.prototype.getObject = function() {
  return group;
}

module.exports = City;