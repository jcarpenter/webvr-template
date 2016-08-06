var EventEmitter = require('eventemitter3'); // Third party module for event handling, built on node default.
// var EventEmitter = require('events').EventEmitter; // Default node event module

// Export singleton by using `new` in module.exports definition. 
// This ensures every instance of EventEmitter, app-wide, will be of the same reference, with shared state and behavior.
module.exports = new EventEmitter();