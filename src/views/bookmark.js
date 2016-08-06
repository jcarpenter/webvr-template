var THREE = require('three');
var config = require('./config');

module.exports = function createBookmark(opt) {
  return new Bookmark(opt)
}

function Bookmark(opt) {
  // make params optional
  opt = opt || {}

  // set defaults
  this.label = opt.label || 'Bookmark'
  this.img = opt.img || 'default'
  this.size = opt.size || '.182'
  this.color = opt.color || '#CCCCCC'
 
  this.object = new THREE.Mesh(
    new THREE.PlaneGeometry(this.size, this.size),
    new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide })
    )

}

Bookmark.prototype.getObject = function() {
  return this.object;
}
