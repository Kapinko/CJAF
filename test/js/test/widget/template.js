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
			options: {
				/**
				 * This is the absolute path to this widget's view.
				 * @type {string}
				 */
				'initViewPath': '/test/js/test/view/template/init.ejs'
			}
		});
	});
}(jQuery, cjaf));