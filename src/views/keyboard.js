"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {}
var group, object;

function Keyboard() {
  this.init();
}

Keyboard.prototype.init = function() {

  group = new THREE.Group();
  object = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(config.keyboard.width, config.keyboard.height),
    new THREE.MeshBasicMaterial({ transparent: true, map: new THREE.TextureLoader().load( 'img/keyboard-1.png'), side: THREE.DoubleSide, shading: THREE.FlatShading })
  )
  group.add(object);
  group.position.set(0, config.user.height - 0.5, config.keyboard.distance);
  group.rotation.set(-0.31, 0, 0)

  uiEvent.on('state_updated', function(newState) { update(newState) });

}

function show() {
  group.visible = true;
  
  object.material.setValues({ opacity: 0 });
  new TWEEN.Tween(object.material)
    .to({ opacity: 1 }, 150)
    .start();
  
  object.position.set(0, 0, -.05);
  new TWEEN.Tween(object.position)
    .to({ z: 0 }, 150)
    .start();
}

function hide() {

  new TWEEN.Tween(object.material)
    .to({ opacity: 0 }, 150)
    .start();
  
  new TWEEN.Tween(object.position)
    .to({ z: -.05 }, 150)
    .onComplete(function(){
      group.visible = false;
    })
    .start();

}

function update(newState) {

  if (oldState && oldState.keyboard) { // if oldState is defined...
    if (oldState.keyboard.open < newState.keyboard.open) { // if keyboard was closed, but is now open, show()
      show();
    } else if (oldState.keyboard.open > newState.keyboard.open) { // if keyboard was open, but is now closed, hide()
      hide();
    }
  } 

  oldState = clone(newState);
}

Keyboard.prototype.getObject = function() {
  return group;
}

module.exports = new Keyboard;