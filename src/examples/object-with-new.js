/* 
An example of a creating objecs with `new`.
Matt Desl says this is not best practice: https://github.com/mattdesl/module-best-practices#api-best-practices
Usage is as follows:
```
objectWithNew = require('./examples/object-with-new.js'),
var test = new objectWithNew();
test.position.set(0, 5, -10);
scene.add(test);
```
*/

var THREE = require('three');

function exampleObjectWithNew() {

	var mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2,2),
		new THREE.MeshBasicMaterial({ color: 0xCC000, side: THREE.DoubleSide })
	)

	return mesh;
}

module.exports = exampleObjectWithNew;