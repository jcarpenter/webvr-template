var THREE = require('three');
var config = require('./config');
// var EventEmitter = require('eventemitter3');
// var interactions = require('./interactions');

function Omni(opt) {
  
  // uiEvent.on('load-site', function(){ console.log("LOAD SITE") })

  // Make params optional
  opt = opt || {}

  // Defaults
  this.url = opt.url || config.omni.url;
  this.width = opt.width || config.omni.width;
  this.height = opt.height || config.omni.height;
  this.color = opt.color || config.omni.color;
 
  this.object = new THREE.Mesh(
    new THREE.PlaneGeometry(this.width, this.height),
    new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide })
    )

  // Listeners

}

function openOmni(){

} 

function closeOmni(){

}

// function open() {
//   console.log("opening OMNI");
// }

Omni.prototype.getObject = function() {
  return this.object;
}

Omni.prototype.setURL = function(string) {
  this.url = string;
}

module.exports = function createOmni(opt) {
  return new Omni(opt)
}
