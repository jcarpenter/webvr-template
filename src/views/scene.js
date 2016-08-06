var TWEEN = require('tween.js');
var THREE = require('three');
var renderer = require('../renderer').getObject();
var uiEvent = require('../event-emitter');
var clone = require('clone');

var VRControls = require('../controls/VRControls');
var VREffect = require('../effects/VREffect');
var polyfill = require('webvr-polyfill/build/webvr-polyfill.js');
var manager = require('webvr-boilerplate/src/main');
// var WebVRConfig = require('../webvrconfig');

var http_indicator = require('./http-indicator').getObject();

var state = require('../state');
var config = require('../config');
var clock = new THREE.Clock();
var Raycaster = require('../raycaster');
var raycaster = Raycaster.getRaycaster();
var mouse = Raycaster.getMouse();
var INTERSECTED = Raycaster.getIntersected();
var controls, effect, display, camera, userHead, scene, light, cube;
var raycaster, mouse, INTERSECTED;

var oldState = {};

function Scene() {
  this.init();
}

Scene.prototype.init = function() {
  
  // setup scene basics
  scene = new THREE.Scene();
  userHead = new THREE.Object3D;
  userHead.position.set(0, config.user.height + .05, 0);
  camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1200 );
  userHead.add(camera);
  camera.add(http_indicator);
  scene.add(userHead)
  light = new THREE.HemisphereLight( 0x000000, 0xffffff,1 );
  scene.add( light );

  // setup WebVR components
  controls = new THREE.VRControls( camera );
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
  };
  manager = new WebVRManager(renderer, effect); // Manager, helps enter and exit VR mode.

  // setupStage(); // Per Boris boilerplate: "For high end VR devices like Vive and Oculus, take into account the stage parameters provided.""
  uiEvent.on('state_updated', function(newState) { update(newState) });

  // start rendering
  animate();
}

function update (newState) {

  if (oldState && oldState.window) { // if oldState is defined...
    if(oldState.window.width != newState.window.width || oldState.window.height != newState.window.height ) {
      onResize();
    }
  }
  oldState = clone(newState);
}

Scene.prototype.getObject = function() {
  return scene;
}

// Gets called by reducer. Reducer listens for events emitted from dispatcher.
function onResize (event) { 
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Per boris's boilerplate:
// "Get the HMD, and if we're dealing with something that specifies stageParameters, rearrange the scene."
// function setupStage() {
//   navigator.getVRDisplays().then(function(displays) {
//     if (displays.length > 0) {
//       display = displays[0];
//       if (display.stageParameters) {
//         setStageDimensions(display.stageParameters);
//       }
//     }
//   });
// }

function animate(time) {

  requestAnimationFrame( animate );
  render();
  TWEEN.update( time );
}

function render() {
 
  // update the picking ray with the camera and mouse position  
  // Use {x:0, y:0} if the Ray should come from the camera instead
  raycaster.setFromCamera( mouse, camera ); 

  // calculate objects intersecting the picking ray
  // var intersects = raycaster.intersectObjects( scene.children, true );

  // if ( intersects.length > 0 ) {

  //   if ( INTERSECTED != intersects[ 0 ].object ) {
  //     if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
  //     INTERSECTED = intersects[ 0 ].object;
  //     INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
  //     INTERSECTED.material.color.setHex( 0xff0000 );
  //   }
  // } else {
  //   if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
  //   INTERSECTED = undefined;
  // }
  
  var delta = clock.getDelta();
  controls.update();
  manager.render(scene, camera, delta);
}

module.exports = new Scene;