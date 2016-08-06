/* 
An example of a utility function module.
Reference: https://github.com/Jam3/jam3-lesson-module-creation#entry-point
Usage is as follows:
```
var exampleUtiltyFunction = require('example-utility-function');
console.log(exampleUtiltyFunction(0.5, 0.25, 0.75));
```
*/

function exampleUtiltyFunction(opts) {
	var first = opts[0];
	var last = opts[1];

	return [ "Name is: " + first + " " + last ];

}

module.exports = exampleUtiltyFunction;