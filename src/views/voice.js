"use strict"
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var diff = require('object-diff');
var oldState = {};
var group, ui, video, background;

function Voice() {
  this.init();
}

Voice.prototype.init = function() {

  video = document.createElement('video');
  video.setAttribute('src', 'mov/voice-search.mp4');
  video.setAttribute('type', 'video/mp4');
  video.id = 'omni_video';
  video.style.display = 'none';
  document.body.appendChild(video);
  
  // listen for end of voice search video then emit event. This triggers hide flow.
  video.addEventListener('ended', function(){
    uiEvent.emit('voice_search_ended' );
  }, false);

  var texture = new THREE.VideoTexture( video );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  group = new THREE.Group;
  ui = new THREE.Mesh(
    new THREE.CircleBufferGeometry( .1, 48 ),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture, transparent: true, side: THREE.DoubleSide, shading: THREE.FlatShading })    
  )

  background = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.8, 32, 32),
    new THREE.MeshBasicMaterial({ color: config.hud.color, transparent: true, side: THREE.BackSide, shading: THREE.FlatShading })
  )

  group.add(ui, background);
  group.position.set( 0, config.user.height, 0);
  ui.position.set( 0, -.15, -.7);

  uiEvent.on('state_updated', function(newState) { update(newState) });
}

function show() {
  
  group.visible = true;
  
  ui.material.setValues({ opacity: 0 });
  new TWEEN.Tween(ui.material)
    .to({ opacity: 1 }, 250)
    .start();

  ui.scale.set(.5, .5, .5);
  new TWEEN.Tween(ui.scale)
    .to({ x: 1, y: 1, z: 1 }, 650)
    .easing(TWEEN.Easing.Elastic.Out)
    .start();

  background.material.setValues({ opacity: 0 });
  new TWEEN.Tween(background.material)
    .to({ opacity: 0.5 }, 250)
    .start();

  video.currentTime = 0;
  video.play();
}

function hide() {

  console.log("hide");
  
  new TWEEN.Tween(ui.material)
    .to({ opacity: 0 }, 250)
    .start();

  new TWEEN.Tween(background.material)
    .to({ opacity: 0 }, 250)
    .onComplete(function(){ group.visible = false; })
    .start();
}

function update(newState) {

  if (oldState && oldState.voice) {

    if ( oldState.voice.open < newState.voice.open ) { 
      show(); // if voice was closed, but is now open, show it
    } else if ( oldState.voice.open > newState.voice.open ){
      hide(); // else if it was open, but is now closed, hide it
    } 
  }

  oldState = clone(newState);
}

Voice.prototype.getObject = function() {
  return group;
}

module.exports = new Voice;