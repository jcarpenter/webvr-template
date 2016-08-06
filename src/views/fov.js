"use strict";
var uiEvent = require('../event-emitter');
var clone = require('clone');
var oldState = {};
var overlay = document.querySelector('#fov');

function Fov() {
  this.init();
}

Fov.prototype.init = function() {
  uiEvent.on('state_updated', function(newState) { update(newState) });
}

function show() {
  overlay.style.display = 'none';
}

function hide() {
  overlay.style.display = 'block';
}

function update(newState) {

  if (oldState && oldState.fov) { // if oldState is defined...
    if (oldState.fov.open < newState.fov.open) { // if fov was closed, but is now open, show it
      show();
    } else if (oldState.fov.open > newState.fov.open) { // if fov was open, but is now closed, hide it
      hide();
    }
  } 

  oldState = clone(newState);
}

module.exports = new Fov;