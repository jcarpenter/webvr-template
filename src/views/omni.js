"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config');
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {};
var group, bar, video, vid_HTTPS, vid_HTTP, tex_HTTPS, tex_HTTP;

function Omni() {
  this.init();
}

Omni.prototype.init = function() {

  // var map = new THREE.TextureLoader().load( 'img/omni-2.png')
   
  // setup HTTPS video texture
  vid_HTTPS = document.createElement('video');
  vid_HTTPS.setAttribute('src', 'mov/omni-https-2.mp4');
  vid_HTTPS.setAttribute('type', 'video/mp4');
  vid_HTTPS.id = 'omni_vid_https';
  vid_HTTPS.style.display = 'none';
  document.body.appendChild(vid_HTTPS);

  tex_HTTPS = new THREE.VideoTexture( vid_HTTPS );
  tex_HTTPS.minFilter = THREE.LinearFilter;
  tex_HTTPS.magFilter = THREE.LinearFilter;
  tex_HTTPS.format = THREE.RGBFormat;

  // setup HTTP video texture
  vid_HTTP = document.createElement('video');
  vid_HTTP.setAttribute('src', 'mov/omni-http-1.mp4');
  vid_HTTP.setAttribute('type', 'video/mp4');
  vid_HTTP.id = 'omni_vid_http';
  vid_HTTP.style.display = 'none';
  document.body.appendChild(vid_HTTP);

  tex_HTTP = new THREE.VideoTexture( vid_HTTP );
  tex_HTTP.minFilter = THREE.LinearFilter;
  tex_HTTP.magFilter = THREE.LinearFilter;
  tex_HTTP.format = THREE.RGBFormat;

  // setup omni object
  bar = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(config.omni.width, config.omni.height),
    new THREE.MeshBasicMaterial({ transparent: true, map: tex_HTTPS, side: THREE.DoubleSide, shading: THREE.FlatShading })
  )

  // video variable tracks which texture to use. 
  // is exception to the "track state in one place" rule.
  video = vid_HTTPS;

  group = new THREE.Group();
  group.add(bar);
  group.position.set(0, config.user.height - .29, config.omni.distance);

  uiEvent.on('object_clicked', function(object){ 
    if(object == bar) { // if object clicked is omni...
      uiEvent.emit('toggle_keyboard');
    }
  } );
  
  uiEvent.on('state_updated', function(newState) { update(newState) });
}

function show() {

  group.visible = true;
  video.pause();
  video.currentTime = 0;
  new TWEEN.Tween(bar.material)
    .to({ opacity: 1 }, 50)
    .start();

  bar.position.set(0, -.03, 0);
  new TWEEN.Tween(bar.position)
    .to({ y: 0 }, 100)
    .start();
}

function hide() {
  
  new TWEEN.Tween(bar.material)
    .to({ opacity: 0 }, 100)
    .onComplete(function(){ group.visible = false; })
    .start();

  bar.position.set(0, 0, 0);
  new TWEEN.Tween(bar.position)
    .to({ y: -.03 }, 100)
    .start();
}

function showLoading() {
  video.currentTime = 0;
  video.play();
}

function hideLoading() {
  // video.currentTime = 0;
}

function update(newState) {

  if (oldState && oldState.omni) { // if oldState is defined...

    // Update texture map for HTTPS vs HTTP
       
    if (newState.site.https) { // if old site was http, but new one is https, swap...
      video = vid_HTTPS;
      bar.material.map = tex_HTTPS;
      bar.material.needsUpdate = true;
    } else if (newState.site.https == false) { // if old site was https, but new one is http, swap...
      video = vid_HTTP;
      bar.material.map = tex_HTTP;
      bar.material.needsUpdate = true;
    }

    // Show/hide omni bar as needed

    if (oldState.site.loading < newState.site.loading) { // if site has started loading
      if (oldState.omni.open == false) show(); // if omni isn't already open, show it
      showLoading(); // show loading indicators
    } else if (oldState.hud.open < newState.hud.open) { // else if hud has opened...
      if (oldState.omni.open == false) show(); // if omni isn't already open, show it
    } else if (oldState.hud.open > newState.hud.open) { // else if hud has closed...
      if (newState.site.loading !== true ) hide(); // if site is not currently loading, hide it...
    } else if (oldState.omni.open > newState.omni.open) {  // else if omni has closed for any other reason, hide it.
      hide(); // hide omni
      hideLoading();
    }

  } 

  oldState = clone(newState);
}

Omni.prototype.getObject = function() {
  return group;
}

module.exports = new Omni;
  