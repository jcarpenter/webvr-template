"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var uiEvent = require('../../event-emitter') // Enables shared dispatchers and listeners across the app.
var config = require('../../config')
var environment = require('../../views/environment-default').getObject();
var group, quad;

function Vimeo() {
  this.init();
}

Vimeo.prototype.init = function() {
  
  group = new THREE.Group();

  quad = new THREE.Mesh(
    new THREE.PlaneGeometry(config.quad.width * 2, config.quad.height * 2),
    new THREE.MeshBasicMaterial({ color: config.quad.color, transparent: true, side: THREE.DoubleSide, shading: THREE.FlatShading })
  )
  
  quad.position.set(0, config.user.height, config.quad.distance * 2);

  group.add(environment, quad);

  uiEvent.on('object_clicked', function(target){ 
    if(target == quad) { // if object clicked is quad...
      uiEvent.emit('toggle_cinema', { type: 'video' });
    }
  } );


  // uiEvent.on('state_updated', function(newState) { update(newState) });

}

Vimeo.prototype.show = function() {

}

Vimeo.prototype.getObject = function() {
  return group;
}

module.exports = Vimeo;