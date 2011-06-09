/**
 * A wrapper to requirejsify the underscorejs library.
 */
/*jslint nomen:false*/
/*global jQuery:false, define:false, _:false*/

define([
	'ext/underscore',
	'ext/underscore/underscore.string.min'
],
function () {
	return _;
});