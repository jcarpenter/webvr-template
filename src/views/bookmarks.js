"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {}
var group, temp;

function Bookmarks() {
  this.init();
}

Bookmarks.prototype.init = function() {
  
  temp = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(config.bookmarks.width, config.bookmarks.height),
    new THREE.MeshBasicMaterial({ transparent: true, map: new THREE.TextureLoader().load( 'img/bookmarks-4.png'), side: THREE.DoubleSide, shading: THREE.FlatShading })
  )
  group = new THREE.Group();
  group.add(temp);
  group.position.set(0, config.user.height, config.bookmarks.distance);

  // listen for state updates
  uiEvent.on('state_updated', function(newState) { update(newState) })
}

function show() {
  group.visible = true;
  new TWEEN.Tween( temp.material )
    .to({ opacity: 1 }, 150)
    .start();
}

function hide() {
  new TWEEN.Tween( temp.material )
    .to({ opacity: 0 }, 150)
    .onComplete(function(){ group.visible = false; })
    .start();
}

function update(newState) {
  // if hud is open, show bookmarks
  // if hud was open, and is no longer open, hide bookmarks

  if (oldState && oldState.hud) { // if oldState is defined...

    if (oldState.hud.open > newState.hud.open) {  // if hud is open and newState is close
      hide();
    } else if (oldState.hud.open < newState.hud.open) {  // if hud is closed and newState is close
      show();
    }
  } 

  oldState = clone(newState);


}

Bookmarks.prototype.getObject = function() {
  return group;
}

module.exports = new Bookmarks;