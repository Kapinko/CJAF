/**
 * This is an implementation of John Resig's micro-templating.
 * @see http://ejohn.org/blog/javascript-micro-templating
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint evil: true, regexp: false*/
(function ($, cjaf) {
	cjaf.define('cjaf/view/renderer/micro', [],
	function () {
		var Micro	= cjaf.namespace('View.Renderer.Micro', function () {});
		Micro.prototype	= {
			/**
			 * This is the extension used for Micro template files.
			 * @type {string}
			 */
			"extension": ".ejs",
			/**
			 * Compile the given string to a view object.
			 * @param {string} view
			 * @return {function()}
			 */
			"compile": function (view) {
				var blah = "var p=[],print=function(){p.push.apply(p,arguments);};" +
					"with(obj){p.push('" +
					view
					  .replace(/[\r\t\n]/g, " ")
					  .split("<%").join("\t")
					  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
					  .replace(/\t=(.*?)%>/g, "',$1,'")
					  .split("\t").join("');")
					  .split("%>").join(";p.push('")
					  .split("\r").join("\\'") +
					"');}return p.join('');";
				
				return new Function('obj', blah);
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
						if (partials.hasOwnProperty(partial)) {
							data[partials]	= this.compile(partial);
						}
					}
				}
				//if data is not provided then just return the template.
				return data ? template(data) : template;
			}
		};
		return Micro;
	});
}(jQuery, cjaf));