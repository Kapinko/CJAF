/**
 * This is a test portlet for the dashboard widget.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("test/widget/dashboard/portlet/test", [
		"cjaf/global",
		"core/widget/dashboard/portlet/command"
	],
	/**
	 * @param {cjaf.Global} i18n
	 * @param {PortletCommand} PortletCommand
	 */
	function (i18n, PortletCommand) {
		$.widget("cjaf.test_dashboard_portlet_test", {
			options: {
				portletCommand: null
			},

			_create: function () {
				var o	= this.options,
				el		= this.element,
				locale	= i18n.localize(this.widgetName);

				if (!(o.portletCommand instanceof PortletCommand)) {
					$.error("You must provide a portlet command object");
				}

				o.portletCommand.setTitle(locale.title);

				el.html(this._view({}));
			}
		});
	});
}(jQuery, cjaf));