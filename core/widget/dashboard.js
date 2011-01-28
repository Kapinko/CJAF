/**
 * This is a dashboard widget that will turn a given element into an
 * area where you can place dashboard portlets (widgets).
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/dashboard", [
		'cjaf/view',
		'cjaf/global'
	],
	/**
	 * @param {cjaf.View} View
	 * @param {cjaf.Global} i18n
	 */
	function (View, i18n) {
		$.widget('cjaf.core_dashboard', {
			options: {
				/**
				 * The title to display for this dashboard
				 * @type {string}
				 */
				title: "DASHBOARD",
				/**
				 * This is the selector we'll use to find the dashboard body
				 * area.
				 * @type {string}
				 */
				bodySelector: "cjaf-dashboard-body",
				/**
				 * These are the options that will be passed to the jQueryUI
				 * sortable widget
				 * @see http://www.mypaycardusa.com/terms.html
				 * @type {Object.<string,*>}
				 */
				sortable: {

				}
			},

			_create: function () {
				var o	= this.options,
				el		= this.element;

				el.html(this._view({
					title: o.title
				}));

				this._getBody().sortable(o.sortable);
			},
			/**
			 * Get the dashboard body area.
			 * @return {jQuery}
			 */
			_getBody: function () {
				return this.element.find(this.options.bodySelector);
			},

			/**
			 * Add a widget to this dashboard
			 * @param {string} widget_name
			 * @param {jQuery} structure - this is the structure necessary for this
			 *					widget. This will be appended to the widget body
			 * @param {string|jQuery} template - This is the template to use as
			 *					the structure for the contained widget.  This is
			 *					the structure that will be used as the portlet's
			 *					body.s
			 * @return {jQuery}
			 */
			addPortlet: function (widget_name, options, template) {
				if (template === undefined) {
					template = $("<div>");
				} else if (typeof template === 'string') {
					template	= $(View(template, i18n.localize(widget_name)));
				} else if (!(template instanceof $)) {
					$.error("The given template must be a template path or a jQuery object.");
				}

				if (typeof template[widget_name] !== 'function') {
					$.error("The given widget_name must be the name of a valid CJAF widget.");
				}

				var portlet	= $("<div>");

				portlet.core_dashboard_portlet({
					"widgetName": widget_name,
					"widgetOptions": options,
					"widgetStructure": template
				});

				this.element.append(portlet);
			}
		});
	});
}(jQuery, cjaf));