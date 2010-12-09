/** JSLint Declarations */
/*global jQuery:false, cjaf: false*/
/*jslint nomen: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/template', [

	],
	function () {
		$.widget('cjaf.template', {
			options: {
				/**
				 * The data members of this object will be first passed to the
				 * cjaf.view() function to be retrieved as templates and then
				 * passed to the renderer as partials.
				 * @type {Object.<string,*>}
				 */
				"partials": {},
				/**
				 * This object will be merged into the data that is passed directly
				 * to the view template.
				 * @type {Object.<string,*>}
				 */
				"view": {}
			},
			_create: function () {
				var o	= this.options;
				this.element.html(this._view(this.getViewData()));
			},
			/**
			 * Get the data object to pass to the view template.
			 *
			 * @return {Object}
			 */
			getViewData: function () {
				return {};
			}
		});
	});
}(jQuery, cjaf));