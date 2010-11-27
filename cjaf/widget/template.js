/** JSLint Declarations */
/*global jQuery:false, cjaf: false*/
/*jslint nomen: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/template', [

	],
	function () {
		$.widget('cjaf.template', {
			options: {
				initViewPath: null,
				locale: {}
			},
			_create: function () {
				var o	= this.options;
				this.element.html(cjaf.view(o.initViewPath, this.getViewData()));
			},
			/**
			 * Get the data object to pass to the view template.
			 *
			 * @return {Object}
			 */
			getViewData: function () {
				return {
					locale: this.options.locale
				};
			}
		});
	});
}(jQuery, cjaf));