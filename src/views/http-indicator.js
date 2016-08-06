"use strict"
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {};
var group, object;

function HTTPIndicator() {
  this.init();
}

HTTPIndicator.prototype.init = function() {

  group = new THREE.Group();

  object = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(.279,.078),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/http-indicator-2.png'), transparent: true, side: THREE.DoubleSide })
  );
  object.scale.set(.65, .65, .65);
  group.add(object);
  group.position.set(0, -0.4, -0.75);
  group.rotation.set(-.4, 0, 0)
  group.visible = false;
  uiEvent.on('state_updated', function(newState) { update(newState) });
}

function show() { 
  group.visible = false;
  object.material.opacity = 0;
  new TWEEN.Tween( object.material )
    .to({ opacity: 1}, 250)
    .delay(4500)
    .onStart(function(){ group.visible = true; })
    .start();
}

function hide() {
  group.visible = false;
  
}

function update(newState) {
  
  if (oldState && oldState.site) { // if oldState is defined...

    if (oldState.site.https > newState.site.https) { // if old site was https, but new one is http, show indicator
      show();
    } else if (oldState.site.https < newState.site.https) { // else if old site was http, but new one is https, hide indicator
      hide();
    }
  }
  oldState = clone(newState);
}

HTTPIndicator.prototype.getObject = function() {
  return group;
}

module.exports = new HTTPIndicator;