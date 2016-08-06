"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var diff = require('object-diff');
var oldState = {}
var group, background;

function Hud() {
  this.init();
}

Hud.prototype.init = function() {
 
  background = new THREE.Mesh(
    new THREE.SphereBufferGeometry(config.hud.radius, 32, 32),
    new THREE.MeshBasicMaterial({ color: config.hud.color, transparent: true, side: THREE.BackSide, shading: THREE.FlatShading })
  )

  group = new THREE.Group();
  group.add(background);
  group.position.set(0, config.user.height, 0);

  // listen for state updates
  uiEvent.on('state_updated', function(newState) { update(newState) })
}

function show() {
  group.visible = true;
  new TWEEN.Tween( background.material )
    .to({ opacity: .9 }, 150)
    .start();
}

function hide() {
  new TWEEN.Tween( background.material )
    .to({ opacity: 0 }, 150)
    .onComplete(function(){ group.visible = false; })
    .start();
}

function update(newState) {

  if (oldState && oldState.hud) { // if oldState is defined...

    if (oldState.site.id !== newState.site.id) { // if site has changed..
      if (oldState.hud.open) hide(); // if hud is open, hide it
    } else if (oldState.hud.open > newState.hud.open) {  // if hud is open and newState is close
      hide();
    } else if (oldState.hud.open < newState.hud.open) {  // if hud is closed and newState is close
      show();
    }
  } 
  // else { // if oldState is undefined, it is first run, so we should do what newState says.
  //   if (newState.hud.open) show();
  //   else hide();
  // }

  oldState = clone(newState);
}

Hud.prototype.getObject = function() {
  return group;
}

module.exports = new Hud;