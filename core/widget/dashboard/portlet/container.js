/**
 * This is a portlet container that will contain dashboard portlets.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define([
		
	],
	function () {
		$.widget("cjaf.core_dashboard_portlet_container", {
			options: {
				/**
				 * This is the CSS class that will be applied to our attached
				 * element upon initialization.
				 * @type {string}
				 */
				cssClass: "cjaf-portlet-container",
				/**
				 * This jQuery selector to find the sortable containers to
				 * connect with.
				 * @type {string}
				 */
				connectSelector: ".cjaf-portlet-container",
				/**
				 * These are the options that will be passed to the jQueryUI
				 * sortable widget
				 * @see http://jqueryui.com/demos/sortable/
				 * @type {Object.<string,*>}
				 */
				sortable: {
					handle: ".cjaf-portlet-head",
					cursor: "move",
					placeholder: "ui-state-highlight",
					forcePlaceholderSize: true
				}
			},
			
			_create: function () {
				var o	= this.options,
				el		= this.element;
				
				el.addClass(o.cssClass)
				.sortable($.extend({}, o.sortable, {
					connectWith: o.connectSelector
				}));
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
				
				return this.refresh();
			},
			/**
			 * Refresh the sortable. This will cause new items to be recognized.
			 * @return {jQuery}
			 */
			refresh: function () {
				var el	= this.element;
				
				el.sortable("refresh");
				
				return el;
			}
		});
	});
}(jQuery, cjaf));