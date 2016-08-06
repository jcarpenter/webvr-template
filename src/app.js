"use strict";
// var TWEEN = require('tween.js');
// var THREE = require('three');
var uiEvent = require('./event-emitter') // Enables shared dispatchers and listeners across the app.
var Dispatchers = require('./dispatchers'); // Captures user actions and fires actions to reducers. ala Redux.
var Reducers = require('./reducers'); // Captures user actions and fires actions to reducers. ala Redux.

// setup key UI elements
// var bootup = require('./views/bootup');
var fov = require('./views/fov');
var instructions = require('./views/instructions');
var keyboard = require('./views/keyboard').getObject();
var scene = require('./views/scene').getObject();
var site = require('./views/site').getObject();
var hud = require('./views/hud').getObject();
var cinema = require('./views/cinema').getObject();
var transition = require('./views/transition').getObject();
var omni = require('./views/omni').getObject();
var quad = require('./views/quad').getObject();
var bookmarks = require('./views/bookmarks').getObject();
var voice = require('./views/voice').getObject();

// initialize app
function App() {
  this.init();
}

App.prototype.init = function() {
  
  // setup UI
  scene.add(site);
  scene.add(hud);
  scene.add(cinema);
  scene.add(transition);
  scene.add(omni);
  scene.add(quad);
  scene.add(bookmarks);
  scene.add(keyboard);
  scene.add(voice);

  hud.visible = false;
  cinema.visible = false;
  transition.visible = false;
  omni.visible = false;
  quad.visible = false;
  bookmarks.visible = false;
  keyboard.visible = false;
  voice.visible = false;

  // app_setup emit. Initializes oldState of views
  uiEvent.emit('app_setup');
  uiEvent.emit('toggle_instructions');
  uiEvent.emit('toggle_fov');

  // load first site to get things started, after brief delay to allow assets to load
  setTimeout( function(){
    uiEvent.emit('load_site', { id: 'greencubes' });
    // uiEvent.emit('load_site', { id: 'bootup', transition: 'none' });
  }, 1000)

}

module.exports = App;