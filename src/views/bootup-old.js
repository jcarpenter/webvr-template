"use strict";
var state = require('../state');
var uiEvent = require('../event-emitter')

function Bootup() {
  this.init();
}

Bootup.prototype.init = function() {

  var landing = document.createElement('div');
  landing.id = 'bootup';
  landing.innerText = "Hoverboard Prototype"
  document.body.appendChild(landing);

  uiEvent.on('state_updated', this.update );
}

Bootup.prototype.update = function() {
  
  if (state.app == 'running') {
    var landing = document.querySelector('#bootup');
    landing.style.display = 'none';
  }
}

module.exports = new Bootup;