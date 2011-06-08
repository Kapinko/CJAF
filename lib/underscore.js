/**
 * A wrapper to requirejsify the underscorejs library.
 */
/*jslint nomen:false*/
/*global jQuery:false, define:false, _:false*/

(function ($, define) {
	define([
		'ext/underscore',
		'ext/unserscore/underscore.string.min.js'
	],
	function () {
		return _;
	});
}(jQuery, define));