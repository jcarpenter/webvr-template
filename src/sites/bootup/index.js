"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../../state');
var uiEvent = require('../../event-emitter')
var group, plate, background;

function Bootup() {
  this.init();

}

function hide() {

}

function load() {

}

Bootup.prototype.init = function() {

  group = new THREE.Group();

  var plate_texture = new THREE.TextureLoader().load( 'img/bootup-4.jpg');

  // var landing = document.createElement('div');
  // landing.id = 'bootup';
  // landing.innerText = "Hoverboard Prototype"
  // document.body.appendChild(landing);
  
  plate = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( state.quad.width, state.quad.height ),
    new THREE.MeshBasicMaterial({ map: plate_texture, transparent: true, side: THREE.DoubleSide, shading: THREE.FlatShading })
  )

  background = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 4, 20, 20 ),
    new THREE.MeshBasicMaterial({ color: 0x2196F3, transparent: true, side: THREE.BackSide, shading: THREE.FlatShading })
  )

  group.add(plate, background);
  group.position.set( 0, state.user.height + 0.05, -.4 );

  uiEvent.on('object_clicked', function(object){ 
    if(object == plate) { // if object clicked is background plane...
      hide();
    }
  } );

  // uiEvent.on('state_updated', this.update );
}

function hide() {
  
  new TWEEN.Tween(background.material)
    .to({ opacity: 0.5 }, 3500)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();

  new TWEEN.Tween(group.position)
    .to({ z: state.quad.distance - 1 }, 3500)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();
}

Bootup.prototype.update = function() {
  
  // if (state.app == 'running') {
  //   var landing = document.querySelector('#bootup');
  //   landing.style.display = 'none';
  // }
} 

Bootup.prototype.getObject = function(){
  return group;
}

module.exports = Bootup;