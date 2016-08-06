"use strict";
var THREE = require('three');
var renderer;

function Renderer() {
	this.init();
}

Renderer.prototype.init = function() {

	renderer = new THREE.WebGLRenderer( { antialias: true  } );
	renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;
	//renderer.physicallyBasedShading = true;
	//renderer.preserveDrawingBuffer=true;
	//renderer.premultipliedAlpha = true;
	renderer.sortObjects=false;
	//renderer.autoClear=false;
	//renderer.alpha=false;
	// renderer.setClearColor( 0xCCCCCC );

	document.querySelector( '#webgl' ).appendChild( renderer.domElement );

}

Renderer.prototype.getObject = function() {
	return renderer;
}

module.exports = new Renderer;