"use strict";
var THREE = require('three');
var TWEEN = require('tween.js');
var state = require('../state');
var config = require('../config')
var uiEvent = require('../event-emitter');
var clone = require('clone');
var diff = require('object-diff');
var oldState = {}
var group, site_holder, mask;

// sites
var bootup = require('../sites/bootup');
var greencubes = require('../sites/greencubes');
var city = require('../sites/city');
var room = require('../sites/room');
var vimeo = require('../sites/vimeo');
var ars = require('../sites/ars');

function Site() {
  this.init();
}

Site.prototype.init = function() {
  
  group = new THREE.Group();
  site_holder = new THREE.Group();

  mask = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1.5, 24, 24),
    new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: true,
      side: THREE.BackSide
    })
  )

  mask.position.setY(config.user.height);

  group.add(site_holder, mask);
  mask.visible = false;
 
  uiEvent.on('delete_site', function(data) { clearOld() });

  // listen for state updates
  uiEvent.on('state_updated', function(newState) { update(newState) })
}

function hide() {

  mask.material.opacity = 0;
  mask.visible = true;
  new TWEEN.Tween(mask.material)
    .to({ opacity: 1}, 200)
    .onComplete(function(){
      site_holder.visible = false;
      mask.visible = false;
    })
    .start()
}

function show() {

  mask.visible = true;
  mask.material.opacity = 1;
  site_holder.visible = true;
  new TWEEN.Tween(mask.material)
    .to({ opacity: 0}, 200)
    .onComplete(function(){
      mask.visible = false;
    })
    .start()
}

function clearOld() {
  
  // iterates and deletes objects two levels deep into the child scene 
  // (the group the child exports, and more importantly, the children of that group)
  
  for (var i=0; i < site_holder.children.length; i++) {
    var child1 = site_holder.children[i];
    for (var k=0; k < child1.children.length; k++) {
      var child2 = child1.children[i];
      if (child2.material) child2.material.dispose(); 
      if (child2.geometry) child2.geometry.dispose(); 
      child2.parent.remove(child2);
    }
    child1.parent.remove(child1);
  }
}

function loadNew(siteId) {
  clearOld();
  var Site = eval(siteId); // we use eval to convert the incoming site id string into a variable reference
  var siteInstance = new Site; // we create a new instance of the desired scene
  site_holder.add( siteInstance.getObject() );
  siteInstance.show();
}

function update(newState) {

  if ( oldState && oldState.site ) { // if oldState is defined...

    if (oldState.site.id !== newState.site.id) { // if new site is different from old site...
      loadNew( newState.site.id ); // load new scene
    }

    if (oldState.site.open < newState.site.open) { // if site was closed, but is now open, show it
      show();
    } else if (oldState.site.open > newState.site.open) { // if site was open, but is now closed, hide it
      hide();
    }
  } 

  oldState = clone(newState);
}

Site.prototype.getObject = function() {
  return group;
}

module.exports = new Site;