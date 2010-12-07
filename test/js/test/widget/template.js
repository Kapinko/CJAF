/**
 * This is the base site template widget for the CJAF Test Framework.
 */

/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('test/widget/template', [
		'cjaf/widget/template'
	],
	function () {
		$.widget('cjaf.test_template', $.cjaf.template, {
			/**
			 * These are the widget options.
			 */
			options: {}
		});
	});
}(jQuery, cjaf));