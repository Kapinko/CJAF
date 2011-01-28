/**
 * This is an interface object that will be used for message passing between the
 * portlet container and the widget that the portlet contains.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/dashboard/portlet/command", [

	],
	function () {
		/**
		 * The constructor for the portlet command object.
		 * @param {jQuery} target - this is the element where we will pass
		 *					all of the handled events.
		 */
		var PortletCommand	= function (target) {
			/**
			 * This is the element we will trigger all events on.
			 * @type {jQuery}
			 */
			this.target	= target;
		}
		PortletCommand.prototype	= {
			/**
			 * Set the title on the target element.
			 * @param {string|jQuery} title
			 */
			"setTitle": function (title) {
				this.target.trigger("title.change", [title]);
			},

			/**
			 * This function will be called when the portlet maximize event
			 * occurs.
			 * @type {function(jQuery.Event):boolean}
			 */
			"maximizeHandler": $.noop,
			/**
			 * This function will be called when the portlet minimize event
			 * occurs.
			 * @type {function(jQuery.Event):boolean}
			 */
			"minimizeHandler": $.noop,
			/**
			 * This function will be called when the portlet restore event
			 * occurs.
			 * @type {function(jQuery.Event):boolean}
			 */
			"restoreHandler": $.noop
		}

		return PortletCommand;
	});
}(jQuery, cjaf));