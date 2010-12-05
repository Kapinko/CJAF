/**
 * This is a base object/interface for all view renderers. This is how we
 * abstract away the view templating system.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/view/renderer', [

	],
	function () {
		var IsAbstractException	= {
			"name": 'IsAbstractException',
			'message': "Cannot use the abstract renderer as a concrete instance."
		},
		ViewRenderer	= function () {}
		ViewRenderer.prototype	= {
			/**
			 * Convert a given string into a view template.
			 * @param {string} view
			 * @return {*}
			 */
			"compile": function (view) {
				throw IsAbstractException;
			},
			/**
			 * Render a given template into a view string.
			 * @param {*} template,
			 * @param {*} data
			 * @return {string}
			 */
			"render": function (template, data) {
				throw IsAbstractException;
			}
		};

		return ViewRenderer;
	});
}(jQuery, cjaf));