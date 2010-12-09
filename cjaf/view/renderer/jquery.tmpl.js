/**
 * This is a renderer implementation that uses the "official" jQuery templating
 * plugin.
 * @see http://github.com/jquery/jquery-tmpl
 * @see http://api.jquery.com/category/plugins/templates
 * @see http://api.jquery.com/jquery.template
 * @see http://api.jquery.com/jquery.tmpl
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/view/renderer/jquery.tmpl', [
		'jQuery/jquery.tmpl'
	],
	function () {
		var counter	= 0, 
		jQueryTmpl	= cjaf.namespace('View.Renderer.jQueryTmpl', function () {});
		jQueryTmpl.prototype	= {
			/**
			 * Compile the given string to a view object.
			 * @param {string} view
			 * @return {function()}
			 */
			"compile": function (view) {
				return $.template(view);
			},
			/**
			 * Render the given template using the given data.
			 * @param {*} template
			 * @param {*} data
			 * @param {Object.<string, string>} partials
			 * @return {string}
			 */
			"render": function (template, data, partials) {
				if (partials) {
					for (var partial in partials) {
						if (partials.hasOwnProperty(partial)) {
							counter += 1;
							data[partial]	= $.template("p" + counter + partial, partials[partial]);
						}
					}
				}
				return $.tmpl(template, data);
			}
		};
		return jQueryTmpl;
	});
}(jQuery, cjaf));