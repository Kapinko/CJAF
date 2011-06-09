/**
 * This is a dashboard widget that will turn a given element into an
 * area where you can place dashboard portlets (widgets).
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/dashboard", [
		'cjaf/view',
		'cjaf/global',
		"core/widget/dashboard/portlet/container",
		'core/widget/dashboard/portlet'
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
				bodySelector: ".cjaf-dashboard-body",
				/**
				 * This is the CSS class that will be applied to each of the
				 * portlet containers.
				 * @type {string}
				 */
				containerClass: "cjaf-portlet-container",
				/**
				 * These are the options that will be passed to the portlet
				 * container widget as options to the jQueryUI sortable widget.
				 * @type {Object.<string,*>}
				 */
				sortableOptions: {},
				/**
				 * These are the containers for this dashboard.
				 * format:
				 * column_name: {
				 * 		"cssClass": <string>,
				 * 		"isDefault": <boolean>
				 * }
				 * @type {Object.<string, *>}
				 */
				"containers": {},
				/**
				 * This is the element that will be cloned to create the
				 * portlet containers.
				 * @type {jQuery}
				 */
				"container": $("<div>")
			},

			_create: function () {
				var o	= this.options,
				el		= this.element;
				
				/**
				 * A has of the portlet containers
				 * @type {Obejct.<string, jQuery>}
				 */
				this.containers	= {};
				/**
				 * This is the name of the default portlet container
				 * @type {string}
				 */
				this.defaultName	= null;

				el.html(this._view({
					title: o.title
				}));
				
				$.each(o.containers, $.proxy(function (name, options) {
					if (!this.defaultName || options.isDefault) {
						this.defaultName	= name;
					}
					
					this.addContainer(name, options);
				}, this));
			},
			/**
			 * Get the dashboard body area.
			 * @return {jQuery}
			 */
			_getBody: function () {
				return this.element.find(this.options.bodySelector);
			},
			/**
			 * Add the given portlet to the container known by the given name.
			 * @param {string} container_name
			 * @param {string} widget_name,
			 * @param {Object.<string,*>} options
			 * @return {jQuery}
			 */
			"addPortlet": function (container_name, widget_name, options) {
				var container	= this.getContainer(container_name);
				
				if (container) {
					container.core_dashboard_portlet_container("addPortlet", widget_name, options);
				}
				
				return this.element;
			},
			/**
			 * Add a container to this dashboard
			 * @param {string} name
			 * @param {Object.<string, *>} options
			 * @return {jQuery}
			 */
			"addContainer": function (name, options) {
				var o		= this.options,
				container	= o.container.clone();
				
				this._getBody().append(container);
				
				container.core_dashboard_portlet_container($.extend({
					"name": name,
					"cssClass": o.containerClass
				}, options));
				
				this.containers[name] 	= container;
				
				return this.element;
			},
			/**
			 * Remove the portlet container (and all of it's contained
			 * portlets) known by the given name.
			 * @param {string} name
			 * @return {jQuery}
			 */
			"removeContainer": function (name) {
				var container	= this.containers[name];
				
				if (container) {
					container.remove();
				}
				
				return this.element;
			},
			/**
			 * Get the portlet container known by the given name.
			 * @return {jQuery}
			 */
			"getContainer": function (name) {
				return this.containers[name];
			}
		});
	});
}(jQuery, cjaf));