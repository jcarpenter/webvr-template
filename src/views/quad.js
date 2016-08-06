var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var diff = require('object-diff');
var uiEvent = require('../event-emitter')
var clone = require('clone');
var oldState = {};
var object;

function Quad() {
  this.init();
}

Quad.prototype.init = function() {

  // setup object
  object = new THREE.Mesh(
    new THREE.PlaneGeometry(config.quad.width, config.quad.height),
    new THREE.MeshBasicMaterial({ color: config.quad.color, transparent: true, side: THREE.DoubleSide, shading: THREE.FlatShading })
  )
  
  object.position.set(0, config.user.height, config.quad.distance);

  uiEvent.on('state_updated', function(newState) { update(newState) });
}

function hide() {
  new TWEEN.Tween( object.material )
    .to({ opacity: 0 }, 500)
    .onComplete(function(){
      object.visible = false;
    })
    .start()
}

function show() {
  object.visible = true;
  new TWEEN.Tween( object.material )
    .to({ opacity: 1 }, 500)
    .start()
}

function update(newState) {

  // Notes: disable quad for time being. Fake classic sites as VR sites.
  // TODO: eventually, add 'hud is open' scenario. Dims the quad and pushes it back?
  
  // if (oldState && oldState.quad) { // if oldState is defined...

  //   if (newState.site.loading && oldState.quad.open) { // if site is loading and quad is visible;
  //     hide();
  //   } else if (oldState.site.loading > newState.site.loading && newState.site.type == "2d") { // if site was loading, but is now finished, and if site type == 2D, show
  //     show();
  //   }
  // } 
  
  oldState = clone(newState);
}

Quad.prototype.getObject = function() {
  return object;
}

module.exports = new Quad;