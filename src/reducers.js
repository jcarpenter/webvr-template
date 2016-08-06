"use strict";
var uiEvent = require('./event-emitter');
var state = require('./state');
var config = require('./config');
var sites = require('./sites/sites');
var scene = require('./views/scene').getObject();
var Raycaster = require('./raycaster');
var raycaster = Raycaster.getRaycaster();
var mouse = Raycaster.getMouse();
var INTERSECTED = Raycaster.getIntersected();

function Reducers() {
  this.init();
}

// Setup listeners

Reducers.prototype.init = function() {

  uiEvent.once('app_setup', app_setup );
  uiEvent.on('toggle_hud', toggle_hud );
  uiEvent.on('toggle_fov', toggle_fov );
  uiEvent.on('toggle_keyboard', toggle_keyboard );
  uiEvent.on('toggle_cinema', toggle_cinema );
  uiEvent.on('toggle_voice', toggle_voice );
  uiEvent.on('toggle_site', toggle_site );
  uiEvent.on('voice_search_ended', voice_search_ended );
  // uiEvent.on('load_site', function(data) { 
  //   if ( data.transition != 'none' ) {
  //     load_site_with_transition(data);
  //   } else {
  //     load_site(data);
  //   }
  // });
  uiEvent.on('load_site', function(data){ load_site(data) } );
  uiEvent.on('toggle_instructions', toggle_instructions );
  uiEvent.on('finished_site_loading_transition', finished_site_loading_transition );
  uiEvent.on('resize', resize );
  uiEvent.on('touch', function(event) { onTouch(event) } );
  uiEvent.on('mouse_move', function(event) { onMouseMove(event) } );
  uiEvent.on('mouse_click', function(event) { onMouseClick(event) } );
}

// Reducers functions: these that process incoming actions and, where applicable, update state.

function app_setup() {
  // state.app = 'running';
  uiEvent.emit('state_updated', state);
}

function toggle_hud() {
  
  if ( state.voice.open ) { // first check if voice is open.
    state.voice.open = false; // if it's open when user presses space, it should close.
  } else if (state.hud.open) { // if HUD is open...
    state.hud.open = false; // close it
    if (state.omni.open) state.omni.open = false; // if omni is open, close it.
  } else { // if HUD is closed...
    state.hud.open = true; // open it
    if (state.omni.open == false) state.omni.open = true; // if omni is closed, open it.
  };

  // state.hud.open = !state.hud.open;
  uiEvent.emit('state_updated', state);
}

function toggle_fov() {
  state.fov.open = !state.fov.open; // invert fov overlay state
  uiEvent.emit('state_updated', state);
}

function toggle_keyboard() {
  state.keyboard.open = !state.keyboard.open; // invert keyboard state
  uiEvent.emit('state_updated', state);
}

function toggle_cinema() {

  if (state.cinema.open) { // if cinema was open, close it

    state.cinema.open = !state.cinema.open; // close it
    uiEvent.emit('state_updated', state); // update state. Triggers hide() function in cinema view 

    // wait for cinema hide() function to play, then reveal site.
    setTimeout( function(){
      state.site.open = true; // hide active site
      uiEvent.emit('state_updated', state);
    }, 250);

  } else if (!state.cinema.open) { // else if cinema was closed, open it
    
    state.site.open = false; // hide current site
    uiEvent.emit('state_updated', state); // update state. Triggers hide() function in site view 

    // wait for site hide() function to play, then reveal cinema.
    setTimeout( function(){
      state.cinema.open = !state.cinema.open; // set cinema state to open
      uiEvent.emit('state_updated', state);
    }, 250);

  }

  // state.cinema.open = !state.cinema.open; // update to new cinema state (invert)
  // uiEvent.emit('state_updated', state);
}

function toggle_site() {
  state.site.open = !state.site.open; // invert site state
  uiEvent.emit('state_updated', state);
}

function toggle_voice() {
  state.voice.open = !state.voice.open; // invert voice state
  uiEvent.emit('state_updated', state);
}

function voice_search_ended() {
  // when voice search is complete, this event is fire.
  state.voice.open = false;
  uiEvent.emit('state_updated', state);
}

// function load_site(object) {

//   // load_site loads new sites -without- transitions.

//   var incomingSite = sites[object.id];

//   state.site.type = incomingSite.type;
//   state.site.title = incomingSite.title;
//   state.site.url = incomingSite.url;
//   state.site.id = incomingSite.id;
//   uiEvent.emit('state_updated', state);
// }

function load_site(object) {
  
  var incomingSite = sites[object.id];
  
  // 1) Start transition and display omni bar
  if (state.omni.open == false) state.omni.open = !state.omni.open; // if omni is closed, open it.
  if (state.hud.open == true) state.hud.open = !state.hud.open; // if hud is open, close it.
  state.site.loading = true;
  state.site.https = incomingSite.https;
  uiEvent.emit('state_updated', state);

  // 2) Once transition is fully opaque, trigger finished_loading function
  setTimeout( function(){ 
    finished_site_loading_transition(object) 
  }, config.transition.duration);
  
}

function finished_site_loading_transition(object) {

  var incomingSite = sites[object.id];

  // swap sites
  state.site.type = incomingSite.type;
  state.site.title = incomingSite.title;
  state.site.url = incomingSite.url;
  state.site.id = incomingSite.id;
  uiEvent.emit('state_updated', state);

  // start transition exit
  setTimeout( function(){ 
    state.site.loading = false; 
    uiEvent.emit('state_updated', state);

    // start omni exit
    setTimeout( function(){
      if ( state.hud.open == false ) state.omni.open = false; // if hud isn't open (eg: has not been opened by user during loading), close omni
      uiEvent.emit('state_updated', state);
    }, 3000);

  }, 500);
}

function toggle_instructions() {
  state.instructions.open = !state.instructions.open;
  uiEvent.emit('state_updated', state);
}

function resize() {
  // uiEvent.emit('state_updated', state);
  state.window.width = window.innerWidth;
  state.window.height = window.innerHeight;
  uiEvent.emit('state_updated', state);
}

function onTouch(event) {
  event.preventDefault();
  uiEvent.emit('load_site', { id: 'bootup', transition: 'none' });
}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
  event.preventDefault(); 
  var intersects = raycaster.intersectObjects( scene.children, true ); // returns array of objects currently being hit by raycaster
  uiEvent.emit('object_clicked', intersects[0].object); // emit object_clicked event, and pass through the object that's clicked. 
}

module.exports = new Reducers; 