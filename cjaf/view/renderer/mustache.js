/**
 * This is a renderer implementation that uses the JavaScript implementation
 * of the mustache templating engine.
 * @see mustache.github.com
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false, Mustache: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/view/renderer/mustache', [
		'lib/mustache'
	],
	function () {
		var jQueryTmpl	= cjaf.namespace('View.Renderer.Mustache', function () {});
		jQueryTmpl.prototype	= {
			/**
			 * This is the file extension used for Mustache template files.
			 * @type {string}
			 */
			"extension": ".mhtml",
			/**
			 * Compile the given string to a view object.
			 * @param {string} view
			 * @return {function()}
			 */
			"compile": function (view) {
				return view;
			},
			/**
			 * Render the given template using the given data.
			 * @param {*} template
			 * @param {*} data
			 * @param {Object.<string,string>} partials
			 * @return {string}
			 */
			"render": function (template, data, partials) {
				return Mustache.to_html(template, data, partials);
			}
		};
		return jQueryTmpl;
	});
}(jQuery, cjaf));