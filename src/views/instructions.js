"use strict";
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {};
var instructionsButton = document.querySelector('#instructionsButton');
var instructions = document.querySelector('#instructions');

function Instructions() {
  this.init();
}

Instructions.prototype.init = function() {
  
  instructionsButton.addEventListener('click', function(evt){ 
    evt.stopPropagation();
    evt.preventDefault();
    uiEvent.emit('toggle_instructions');
  })

  instructions.addEventListener('click', function(evt){ 
    evt.stopPropagation();
    evt.preventDefault();
    uiEvent.emit('toggle_instructions');
  })

  uiEvent.on('state_updated', function(newState) { update(newState) });

}

function update(newState) {
  
  if (oldState && oldState.instructions) { // if oldState is defined...

    if (oldState.instructions.open < newState.instructions.open) { // if instructions were closed, but are now open, show them
      instructions.style.display = 'none';
      instructionsButton.style.display = 'block';
    } else if (oldState.instructions.open > newState.instructions.open) { // else if instructions were open, but are now closed, hide them
      instructions.style.display = 'block';
      instructionsButton.style.display = 'none';
    }
  } 

  oldState = clone(newState);
}

module.exports = new Instructions;