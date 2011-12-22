/**
 * This is a renderer implementation that uses the JavaScript implementation
 * of the handlebars templating engine, this engine is a superset of mustache
 * so it should be compatible.
 * @see handlebarsjs.com
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false, Handlebars: false,*/

(function ($, cjaf) {
    cjaf.define('cjaf/view/renderer/mustache', [
		'lib/handlebars'
	],
	function () {
		var Renderer	= cjaf.namespace('View.Renderer.Handlebars', function () {});
		Renderer.prototype	= {
			/**
			 * This is the file extension used for Handlebars template files.
			 * @type {string}
			 */
			"extension": ".stache",
			/**
			 * Compile the given string to a view object.
			 * @param {string} view
			 * @return {function()}
			 */
			"compile": function (view) {
				return Handlebars.compile(view);
			},
			/**
			 * Render the given template using the given data.
			 * @param {*} template
			 * @param {*} data
			 * @param {Object.<string,string>} partials
			 * @return {string}
			 */
			"render": function (template, data, partials) {
                if (partials) {
                    for (var partial in partials) {
                        Handlebars.registerPartial(partial, partials[partial]);
                    }
                }
                return template(data);
			}
		};
		return Renderer;
	});
}(jQuery, cjaf));