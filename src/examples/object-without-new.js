/* 
An example of creating an object without new, and passing it options via object
Reference: https://github.com/mattdesl/module-best-practices#api-best-practices
Reference (gist): https://gist.github.com/mattdesl/d074d956f07821f7d3bb
Usage is as follows:
```
ObjectWithoutNew = require('./examples/object-without-new.js');
var b1 = ObjectWithoutNew({
  label: "Bookmark 1",
  size: 3,
  img: "bitmap.png",
  color: "#FF0BA0"
});
b1.getObject().position.set(-5, -2, -10);
scene.add(b1.getObject());
```
*/

var THREE = require('three');

module.exports = function createBookmark(opt) {
  return new Bookmark(opt)
}

function Bookmark(opt) {
  // make params optional
  opt = opt || {}

  // set defaults
  this.label = opt.label || 'Bookmark'
  this.img = opt.img || 'default'
  this.size = opt.size || '2'
  this.color = opt.color || '#CCCCCC'
 
  this.object = new THREE.Mesh(
    new THREE.PlaneGeometry(this.size, this.size),
    new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide })
    )

}

Bookmark.prototype.getObject = function() {
  // console.log(this.object);
  return this.object;
}
