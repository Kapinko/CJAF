/**
 * This widget represents an item that can be placed into a dashboard widget's
 * body.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/dashboard/portlet", [
		"core/widget/dashboard/portlet/command"
	],
	/**
	 * @param {PortletCommand} PortletCommand
	 */
	function (PortletCommand) {
		$.widget("cjaf.core_portlet", {
			options: {
				/**
				 * This is the name of the widget that will make up our body.
				 * This name must map to a valid CJAF widget.
				 * @type {string}
				 */
				"widgetName": null,
				/**
				 * These are the options that we'll be passing to the
				 * body widget's constructor.
				 * @type {Object.<string,*>}
				 */
				"widgetOptions": {},
				/**
				 * This is the selector that will be used to find the portlet's
				 * body element.
				 * @type {string}
				 */
				"bodySelector": ".cjaf-portlet-body",
				/**
				 * This is the selector that will be used to find the portlet's
				 * head element.
				 * @type {string}
				 */
				"headSelector": ".cjaf-portlet-head"
			},
			_create: function () {
				var o	= this.options,
				el		= this.element,
				body;

				el.html(this._view({}));

				el.bind("title.change", $.proxy(this, "_handleTitleChange"))
					.bind("portlet.maximize", $.proxy(this, "_handleMaximize"))
					.bind("portlet.minimize", $.proxy(this, "_handleMinimize"));

				body	= this._getBody();

				if (typeof body[o.widgetName] === 'function') {
					$.error("You must provide a valid CJAF widget to the portlet container.");
				}
				body[o.widgetName](o.widgtOptions);

				this._getBody()[o.widgetName](o.widgetOptions);
			},

			_getBody: function () {
				return this.element.find(this.options.bodySelector);
			},

			_getHead: function () {
				return this.element.find(this.options.headSelector);
			},

			/**
			 * Handle a title change event.
			 * @param {jQuery.Event} event,
			 * @param {string|jQuery} title
			 * @return {boolean}
			 */
			_handleTitleChange: function (event, title) {
				this._getHead().html(title);
			},
			/**
			 * Handle the minimize event.
			 * @param {jQuery.Event}
			 * @return {boolean}
			 */
			_handleMinimize: function (event) {
				console.log("_handleMinimize");
				console.log(arguments);
			},
			/**
			 * Handle the maximize event.
			 * @param {jQuery.Event}
			 * @return {boolean}
			 */
			_handleMaximize: function (event) {
				console.log("_handleMaximize");
				console.log(arguments);
			}
		});
	});
}(jQuery, cjaf));