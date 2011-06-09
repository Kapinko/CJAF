/**
 * A requirejs wrapper for the jasmine testing library.
 */
/*jslint nomen:false*/
/*global define:false, jasmine:false*/

define([
	'ext/jasmine/lib/jasmine-1.0.2/jasmine',
	'ext/jasmine/lib/jasmine-1.0.2/jasmine-html'
],
function () {
	return {
		'getLib': function () {
			return jasmine;
		},
		'run': function () {
			jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
			jasmine.getEnv().execute();
		}
	};
});