"use strict"
var THREE = require('three');
var raycaster, mouse, INTERSECTED;

function Raycaster() {
  this.init();
}

Raycaster.prototype.init = function() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(), INTERSECTED;
  // console.log(raycaster);
  // console.log(mouse);
}

Raycaster.prototype.getRaycaster = function() {
  return raycaster;
}

Raycaster.prototype.getMouse = function() {
  return mouse;
}

Raycaster.prototype.getIntersected = function() {
  return INTERSECTED;
}


module.exports = new Raycaster;