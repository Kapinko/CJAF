/**
 * This is a test page for the dashboard widget.
 */
/*jslint nomen:false*/
/*global jQuery:false,cjaf:false*/

(function ($, cjaf) {
	cjaf.define("test/widget/page/widgets/dashboard", [
		"core/widget/dashboard",
		"test/widget/dashboard/portlet/test"
	],
	function () {
		$.widget("cjaf.test_page_widgets_dashboard", {
			options: {

			},

			_create: function () {
				var el	= this.element,
				dashboard;

				el.html(this._view({}));

				dashboard	= el.find('#dashboard');

				dashboard.core_dashboard();
				dashboard.core_dashboard("addPortlet", "test_dashboard_portlet_test", {});
				dashboard.core_dashboard("addPortlet", "test_dashboard_portlet_test", {});
				dashboard.core_dashboard("addPortlet", "test_dashboard_portlet_test", {}); 

			}
		});
	});
}(jQuery, cjaf));