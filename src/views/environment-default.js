"use strict"
var THREE = require('three');

var group, background, floor;

function Environment() {
  this.init();
}

Environment.prototype.init = function() {
    
    group = new THREE.Group();

    background = new THREE.Mesh(
      new THREE.SphereBufferGeometry(100, 64, 64),
      new THREE.MeshBasicMaterial({ 
        map: new THREE.TextureLoader().load( 'img/environments/default-1.png' ),
        side: THREE.BackSide
      })
    ) 


    group.add(background);

}

Environment.prototype.getObject = function() {
  return group;
}

module.exports = new Environment;