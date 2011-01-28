/**
 * This is a test page for the dashboard widget.
 */
/*jslint nomen:false*/
/*global jQuery:false,cjaf:false*/

(function ($, cjaf) {
	cjaf.define("test/widget/page/widgets/dashboard", [
		"core/widget/dashboard"
	],
	function () {
		$.widget("cjaf.test_page_widgets_dashboard", {
			options: {

			},

			_create: function () {
				var el	= this.element;

				el.html(this._view({}));

				el.find("#dashboard").core_dashboard();
			}
		});
	});
}(jQuery, cjaf));