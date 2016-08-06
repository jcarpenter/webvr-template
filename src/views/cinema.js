"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var diff = require('object-diff');
var oldState = {}
var group, screen, shadow, back, videoControls, background;

function Cinema() {
  this.init();
}

Cinema.prototype.init = function() {

// var map = new THREE.TextureLoader().load( 'img/omni-2.png')
   
  // setup omni video texture
  // video = document.createElement('video');
  // video.setAttribute('src', 'mov/omni-animated.mp4');
  // video.setAttribute('type', 'video/mp4');
  // video.id = 'omni_video';
  // video.style.display = 'none';
  // document.body.appendChild(video);

  // var texture = new THREE.VideoTexture( video );
  // texture.minFilter = THREE.LinearFilter;
  // texture.magFilter = THREE.LinearFilter;
  // texture.format = THREE.RGBFormat;

  background = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 100, 64, 64 ),
    new THREE.MeshBasicMaterial({ 
      map: new THREE.TextureLoader().load( 'img/environments/cinema-2.png' ),
      transparent: true, 
      side: THREE.BackSide, 
      shading: THREE.FlatShading 
    })
  )

  background.rotation.set(0, 3.14, 0);

  group = new THREE.Group();

  screen = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(config.cinema.width, config.cinema.height),
    new THREE.MeshBasicMaterial({ 
      transparent: true, 
      map: new THREE.TextureLoader().load('img/video-screenshot-1.jpg'),
      side: THREE.DoubleSide, 
      shading: THREE.FlatShading 
    })
  )

  shadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(config.cinema.width + .075, config.cinema.height + .075),
    new THREE.MeshBasicMaterial({ 
      transparent: true, 
      map: new THREE.TextureLoader().load('img/video-shadow.png'),
      side: THREE.DoubleSide, 
      shading: THREE.FlatShading 
    })
  )

  back = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(.04, .04),
    new THREE.MeshBasicMaterial({ 
      transparent: true,
      map: new THREE.TextureLoader().load('img/back.png'),
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    })
  )

  videoControls = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(config.cinema.videoControls_width, config.cinema.videoControls_height),
    new THREE.MeshBasicMaterial({ 
      transparent: true,
      map: new THREE.TextureLoader().load('img/video-controls.png'),
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    })
  )

  screen.add(videoControls, shadow, back);
  // position back button to left side of screen
  shadow.position.set(0, 0, -.001)
  back.position.set(0 - (config.cinema.width / 2) - .075, (config.cinema.height / 2) - .025, .001)
  // position video controls at bottom of cinema window
  videoControls.position.set(0, 0 - ((config.cinema.height / 2) - (config.cinema.videoControls_height / 2)), .001)

  group.add(background, screen);
  screen.position.set(0, config.user.height, config.cinema.distance);
  // group.position.set(0, config.user.height, config.cinema.distance);
  // group.scale.set(1,1,1);

  uiEvent.on('object_clicked', function(object){ 
    if(object == back) { // if object clicked is omni...
      uiEvent.emit('toggle_cinema');
    }
  } );
  
  uiEvent.on('state_updated', function(newState) { update(newState) });
}

function show() {
  
  group.visible = true;

  screen.material.opacity = 0;
  new TWEEN.Tween(screen.material)
    .to({ opacity: 1 }, 250)
    .start();

  screen.position.setZ(config.cinema.distance - .1);
  new TWEEN.Tween(screen.position)
    .to({z: config.cinema.distance}, 250)
    .start();

  background.material.opacity = 0;
  new TWEEN.Tween(background.material)
    .to({ opacity: 1 }, 250)
    .start();

}

function hide() {

  new TWEEN.Tween(screen.material)
    .to({ opacity: 0 }, 250)
    .start();

  new TWEEN.Tween(background.material)
    .to({ opacity: 0 }, 250)
    .onComplete(function(){ group.visible = false; })
    .start();

}

function update(newState) {

  // cinema mode can be covered by hud. Open hud pauses playback/
  // cinema mode pushes back active quad
  // need to implement quad system?
  // cinema mode is not a site. Like HUD, it is opened/closed from other content.
  // create cinema mode. bind to c key. practice engaging it from bootup.

  if ( oldState && oldState.cinema ) {
    if ( oldState.cinema.open < newState.cinema.open ) { // if cinema was closed, but is now open, show it
      show();

      if (newState.cinema.content_type == 'video') {
        showVideoControls();
      }

    } else if ( oldState.cinema.open > newState.cinema.open ) { // else if cinema was open, but is now closed, hide it
      hide();
    }
  }

  oldState = clone(newState);

}

Cinema.prototype.getObject = function() {
  return group;
}

module.exports = new Cinema;