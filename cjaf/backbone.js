/**
 * This is a library object that will properly retrieve the BackboneJS library.
 */
/*jslint nomen:false*/
/*global define:false,Backbone:false*/

(function (define) {
	define([
		'order!ext/json2',
		'order!ext/underscore',
		'order!ext/backbone'
	],
	function () {
		return Backbone;
	});
}(define));