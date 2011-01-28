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
		$.widget("cjaf.core_dashboard_portlet", {
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
				 * This is the structure that will be placed into the portlet's
				 * body element and then the widget will be applied to this
				 * structure element if it is set.
				 * @type {jQuery}
				 */
				"widgetStructure": null,
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
				"headSelector": ".cjaf-portlet-head",
				/**
				 * This is the class that will be used to denote that the attached
				 * element is a portlet widget.
				 * @type {string}
				 */
				"portletClass": "cjaf-portlet"
			},
			_create: function () {
				var o	= this.options,
				el		= this.element,
				command;

				el.html(this._view({}));
				el.addClass(o.portletClass);

				el.bind("title.change", $.proxy(this, "_handleTitleChange"))
					.bind("portlet.maximize", $.proxy(this, "_handleMaximize"))
					.bind("portlet.minimize", $.proxy(this, "_handleMinimize"));

				command	= new PortletCommand(el);

				this._initHead(command);
				this._initBody(command);
			},

			"getBody": function () {
				return this.element.find(this.options.bodySelector);
			},

			"getHead": function () {
				return this.element.find(this.options.headSelector);
			},

			/**
			 * Handle a title change event.
			 * @param {jQuery.Event} event,
			 * @param {string|jQuery} title
			 * @return {boolean}
			 */
			_handleTitleChange: function (event, title) {
				this.getHead().html(title);
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
			},
			/**
			 * Set up the header of this portlet.
			 * @param {PortletCommand} command
			 */
			_initHead: function (command) {
				
			},
			/**
			 * Set up the body of this portlet
			 * @param {PortletCommand} command
			 */
			_initBody: function (command) {
				var o	= this.options,
				el		= this.element,
				body	= this.getBody();

				if (typeof body[o.widgetName] !== 'function') {
					$.error("You must provide a valid CJAF widget to the portlet container.");
				}

				$.extend(o.widgetOptions, {
					"portletCommand": command
				});

				if (o.widgetStructure instanceof $) {
					o.widgetStructure[o.widgetName](o.widgetOptions);
					body.html(o.widgetStructure);
				} else {
					body[o.widgetName](o.widgetOptions);
				}
			}
		});
	});
}(jQuery, cjaf));