/**
 * This is a form helper that assists in the form event
 * triggers.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/helper/trigger', [
		'cjaf/widget/form/helper/event',
		'cjaf/widget/form/listener/submit_with_spinner'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 * @return {cjaf.Widget.Form.Helper.Handler}
	 */
	function (EventHelper) {
		/**
		 * Is the given element a button?
		 * @param {jQuery} el
		 * @return {boolean}
		 */
		var is_button	= function (el) {
			return el.is(':button, :input[type="submit"]');
		},
		/**
		 * This is an object that handles all of the form event triggering
		 * and trigger binding.
		 * @param {jQuery} form
		 * @param {string} widget_name
		 * @constructor
		 */
		Trigger	= cjaf.namespace('Form.Helper.Trigger', function (form, widget_name) {
			if (!form.is('form')) {
				throw "You must provide a form widget to the form UI helper.";
			}
			/**
			 * This is the form that we're working with.
			 * @param {jQuery} form
			 */
			this.form	= form;
			/**
			 * @type {string}
			 */
			this.widget_name	= widget_name;
		});
		Trigger.prototype	= {
			/**
			 * Bind the submit trigger click event to the submit function.
			 * @param {jQuery} trigger
			 * @param {Object.<string,*>} options
			 * @return {jQuery}
			 */
			"bindSubmit": function (trigger, options) {
				var form	= this.form,
				widget	= this.widget_name;
				
				if (is_button(trigger)) {
					options = $.extend({}, options, {"form": form});
					trigger.submit_with_spinner(options);
				}
				
				trigger.click(function (event) {
					form[widget]("submit");
					event.preventDefault();
					
				});
				return form;
			},
			/**
			 * Bind a clear form trigger.
			 * @param {jQuery} trigger
			 * @param {Object.<string,*>} options
			 * @return {jQuery}
			 */
			"bindClear": function (trigger, options) {
				var form	= this.form,
				widget	= this.widget_name,
				primary		= null,
				secondary	= null;
				
				if (is_button(trigger)) {
					if (options.hasOwnProperty('iconPrimary')) {
						primary	= options.iconPrimary;
					}
					if (options.hasOwnProperty('iconSecondary')) {
						secondary	= options.iconSecondary;
					}
					options	= {
						"form": form,
						"primary": primary,
						"secondary": secondary
					};
					trigger.button(options);
				}
				
				trigger.click(function () {
					form[widget]("clear");
				});
				
				return form;
			},
			/**
			 * Trigger the client side submission event.
			 * @return {jQuery}
			 */
			"submitClient": function () {
				this.form.trigger(EventHelper.submit.client);
				return this.form;
			},
			/**
			 * Trigger the validation success event.
			 * @return {jQuery}
			 */
			"validationSuccess": function () {
				this.form.trigger(EventHelper.validation.success);
				return this.form;
			},
			/**
			 * Trigger the validation failure event.
			 * @return {jQuery}
			 */
			"validationFailure": function () {
				this.form.trigger(EventHelper.validation.failed);
				return this.form;
			},
			/**
			 * Trigger the form reset event.
			 * @return {jQuery}
			 */
			"reset": function () {
				this.form.trigger(EventHelper.clear);
				return this.form;
			}
		};

		return Trigger;
	});
}(jQuery, cjaf));