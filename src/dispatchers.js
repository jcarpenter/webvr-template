"use strict";
var uiEvent = require('./event-emitter');

// ## Overall architecture:

// User presses button. Or clicks link. Event is emitted. 
// Emitted event describes action. toggle-hud, load-site, etc. It does not make assumptions about state.

// Event manager listens for the event.
// Updates its state. 
// Emits updated() event. 

// Views receive update call. Views know where to grab state from (central repo).
// Views determine how to update themselves.
// Would be better to pass views the state, but I'm not sure how to do that. So I'll go with a hackier approach.

// Interactions are handled in dispatchers.
// 1) Raycaster module simply returns a raycaster object and variables for mouse, INTERSECT
// 2) Dispatch sets up listeners and emits events when triggered. Events too heavy for mousemove?
// 3) Reducers pick up the events and trigger functions

var waitingForDoubleSpace = false;

function detectDoubleSpace() {
  
  // Differentiates between single and quick-double spacebar presses.
  
  if ( waitingForDoubleSpace == false) {
    waitingForDoubleSpace = true; // set the waiting variable to true
    setTimeout(function(){ // set a delay...
      if (waitingForDoubleSpace == true) uiEvent.emit('toggle_hud'); // once delay has expired, if a second press has not been received, emit toggle_hud action.
      waitingForDoubleSpace = false; // and reset the waiting variable.
    }, 200) // the delay
  } else if ( waitingForDoubleSpace ) { // if a second tap is received while variable is true...
    uiEvent.emit('toggle_voice'); // emit toggle_voice action
    waitingForDoubleSpace = false; // and reset the waiting variable.
  }
}

function Dispatchers() {

  // listen for touches
  var doc = document.querySelector('#webgl')
  doc.addEventListener( 'touchstart', function(event){ uiEvent.emit('mouse_click', event); }, false );

  // listen for mouse movement
  window.addEventListener( 'mousemove', function(event){ uiEvent.emit('mouse_move', event); }, false );

  // listen for mouse clicks
  window.addEventListener( 'click', function(event){ uiEvent.emit('mouse_click', event); }, false );

  // listen for resizes
  window.addEventListener('resize', function(event){ uiEvent.emit('resize', event); }, true );
  window.addEventListener('vrdisplaypresentchange', function(event){ uiEvent.emit('resized', event); }, true );

  // listen for inputs
  window.addEventListener('keydown', function(e){

    var handled = false;

    // Check if meta or ctrl keys are pressed. If not, proceed. Ensures keyboard shortcuts work properly on Mac & Windows.
    if ((!e.metaKey) || (!e.metaKey)) {

      switch (e.keyCode) {
        case 49: { // 1
          uiEvent.emit('load_site', { id: 'greencubes' });
          handled = true;
          break;
        }
        case 50: { // 2
          uiEvent.emit('load_site', { id: 'city' });
          handled = true;
          break;
        }
        case 51: { // 3
          uiEvent.emit('load_site', { id: 'room' });
          handled = true;
          break;
        }
        case 52: { // 4
          uiEvent.emit('load_site', { id: 'vimeo' });
          handled = true;
          break;
        }
        case 53: { // 5
          uiEvent.emit('load_site', { id: 'ars' });
          handled = true;
          break;
        }
        case 32: { // space
          detectDoubleSpace(); // check if space was double or single tapped. This function then emits the correct event.
          handled = true;
          break;
        }
        case 67: { // c
          uiEvent.emit('toggle_cinema', { type: 'video' });
          handled = true;
          break;
        }
        case 75: { // k
          uiEvent.emit('toggle_keyboard'); // check if space was double or single tapped. This function then emits the correct event.
          handled = true;
          break;
        }
        case 68: { // d
          uiEvent.emit('delete_site');
          handled = true;
          break;
        }
        case 73: { // i
          // Logic for instructions toggle breaks is in the instructions view itself.
          // This is an exception to the strict dispatch->reducer->view flow used everywhere else.
          uiEvent.emit('toggle_instructions');
          handled = true;
          break;
        }
        case 79: { // o
          uiEvent.emit('toggle_fov');
          handled = true;
          break;
        }
        case 83: { // s
          uiEvent.emit('toggle_site');
          handled = true;
          break;
        }
      }

      if (handled) e.preventDefault();
    }
  });
};

// Export singleton by using `new` in our exports. 
// This ensures every instance of EventManager, app-wide, will be of the same reference, with shared state and behavior.
module.exports = new Dispatchers;