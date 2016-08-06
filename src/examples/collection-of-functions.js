/*
An example of multiple functions within one module.
Reference: http://eng.wealthfront.com/2015/06/16/an-introduction-to-commonjs/
"You can ... return a collection of functions that don’t share any state:"
Usage is as follows:
```
collectionOfFunctions = require('./examples/collection-of-functions.js');
console.log(collectionOfFunctions.shout("John"));
console.log(collectionOfFunctions.whisper("John"));
```
*/

var Utils = {
	shout: function(string) {
		return( string.toUpperCase() + "!!!" );
	},
	whisper: function(string) {
		return( "psst... " + string.toLowerCase() + "..." );
	}
}

module.exports = Utils;