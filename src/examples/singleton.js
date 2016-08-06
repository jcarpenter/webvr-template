/*
An example of creating a singleton with `new` in module.exports.
Reference: http://eng.wealthfront.com/2015/06/16/an-introduction-to-commonjs/
"Since require caches the value assigned to module.exports, all calls to require the module are given the same reference. This makes creating a singleton extremely similar to creating a class. We simply return a new instance of our class."
Usage is as follows:
```
singleton = require('./examples/singleton.js')
var s1 = singleton;
s1.position.set(-5, 0, -10);
scene.add(s1);
```
*/

var THREE = require('three');

function Plane() {

	var geometry = new THREE.PlaneGeometry(1,3);
	var material = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide });

	var mesh = new THREE.Mesh( geometry, material );
	
	return mesh;

}

// Plane.prototype.setColor = function (color) {
// // 	this.material
// }

module.exports = new Plane;