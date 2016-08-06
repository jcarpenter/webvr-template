"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var uiEvent = require('../../event-emitter') // Enables shared dispatchers and listeners across the app.
var config = require('../../config')
var environment = require('../../views/environment-default').getObject();
var group, quad, highlight, quadParent;

function Ars() {
  this.init();
}

Ars.prototype.init = function() {
  
  group = new THREE.Group();
  quadParent = new THREE.Group();

  quad = new THREE.Mesh(
    new THREE.PlaneGeometry(config.quad.width, config.quad.height),
    new THREE.MeshBasicMaterial({ 
      map: new THREE.TextureLoader().load('img/sites/ars/arstechnica-1.jpg'),
      transparent: true, 
      side: THREE.DoubleSide, 
      shading: THREE.FlatShading 
    })
  )

  highlight = new THREE.Mesh(
    new THREE.PlaneGeometry(config.quad.width + .035, config.quad.height + .035),
    new THREE.MeshBasicMaterial({ 
      color: config.quad.highlightColor,
      transparent: true, 
      side: THREE.DoubleSide, 
      shading: THREE.FlatShading })
  )

  highlight.scale.set(.9, .9, .9);
 
  quad.add(highlight);
  highlight.position.set(0, 0, -.001) 
  quadParent.add(quad);
  quad.position.set(0, 0, config.quad.distance);
  quadParent.position.set(0, config.user.height, 0);
  var multiplier = config.quad.scaleMultiplier;
  quadParent.scale.set(multiplier, multiplier, multiplier)

  group.add(environment, quadParent);

  window.addEventListener('keydown', function(e){
    if ((!e.metaKey) || (!e.metaKey)) {
      if (e.keyCode == 57) {
        adjustPosition();
        e.preventDefault();
      }
    }
  });

  // uiEvent.on('state_updated', function(newState) { update(newState) });

}

function adjustPosition() {
  
  var select = new TWEEN.Tween(highlight.scale)
    .to({x: 1, y: 1, z: 1}, 150)
    .easing(TWEEN.Easing.Quadratic.InOut)

  var left = new TWEEN.Tween(quadParent.rotation)
    .delay(500)
    .to({y: .75}, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
  
  var right = new TWEEN.Tween(quadParent.rotation)
    .delay(250)
    .to({y: -.75}, 1500)
    .easing(TWEEN.Easing.Quadratic.InOut)

  var center = new TWEEN.Tween(quadParent.rotation)
    .delay(250)
    .to({y: 0}, 750)
    .easing(TWEEN.Easing.Quadratic.InOut)

  var forward = new TWEEN.Tween(quad.position)
    .delay(750)
    .to({z: config.quad.distance + .4}, 750)
    .easing(TWEEN.Easing.Quadratic.InOut)

  var backward = new TWEEN.Tween(quad.position)
    .delay(750)
    .to({z: config.quad.distance - .4}, 1250)
    .easing(TWEEN.Easing.Quadratic.InOut)

  var middle = new TWEEN.Tween(quad.position)
    .delay(500)
    .to({z: config.quad.distance}, 500)
    .easing(TWEEN.Easing.Quadratic.InOut)

  var deselect = new TWEEN.Tween(highlight.scale)
    .delay(750)
    .to({x: .9, y: .9, z: .9}, 250)
    .easing(TWEEN.Easing.Quadratic.InOut)

  select.chain(left);
  left.chain(right);
  right.chain(center);
  center.chain(forward);
  forward.chain(backward);
  backward.chain(middle);
  middle.chain(deselect);
  select.start();
}

Ars.prototype.show = function() {
  
  quad.material.opacity = 0;
  new TWEEN.Tween(quad.material)
    .delay(750)
    .to({ opacity: 1 }, 500)
    .start();

  quad.position.setZ(config.quad.distance - .2);
  new TWEEN.Tween(quad.position)
    .delay(750)
    .to({z: config.quad.distance}, 500)
    .start();
}

Ars.prototype.getObject = function() {
  return group;
}

module.exports = Ars;