"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {}
var group, background;


function Transition() {
  this.init();
}

Transition.prototype.init = function() {

  background = new THREE.Mesh(
    new THREE.SphereBufferGeometry(config.hud.radius + 1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1, side: THREE.DoubleSide, shading: THREE.FlatShading})
  )

  group = new THREE.Group();
  group.add(background);
  group.position.set(0, config.user.height, 0);

  // listen for state updates
  uiEvent.on('state_updated', function(newState) { update(newState) })
}

function show() {
  group.visible = true;
  background.material.setValues({ opacity: 0 });
  new TWEEN.Tween( background.material )
    .to({ opacity: 1 }, config.transition.duration)
    .start();
}

function hide() {
  new TWEEN.Tween( background.material )
    .to({ opacity: 0 }, config.transition.duration)
    .onComplete(function(){ group.visible = false; })
    .start();
}

function update(newState) {

  if (oldState && oldState.site) { // if oldState is defined...
    if (oldState.site.loading < newState.site.loading) { // if site is now loading
      show(); // show transition
    } else if (oldState.site.loading > newState.site.loading) { // if site was loading, but is now finished...
      hide(); // hide transition
    }
  } 
  // else { // if oldState is undefined, it is first run, so we should do what newState says.
  //   if( newState.site.loading ) show();
  // }

  oldState = clone(newState);
}

Transition.prototype.getObject = function() {
  return group;
}
module.exports = new Transition;