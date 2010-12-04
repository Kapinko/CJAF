/**
 * This is a widget that will listen for events on a form.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/element/listener', [
		'cjaf/widget/form/helper/event'
	],
	/**
	 * @param {FormEvents} FormEvents
	 */
	function (FormEvents) {
		$.widget('cjaf.form_element_listener', {
			options: {
				fieldList: []
			},
			/**
			 * Initialize this form element listener.
			 */
			_create: function () {
				var el	= this.element,
					o	= this.options, x, field;

				if (!$.isArray(o.fieldList)) {
					o.fieldList	= [];
				}
				if (el.is(':input')) {
					o.fieldList.push(el);
				}
				if (o.fieldList.length < 1) {
					throw "You must provide a list of fields for this listener to listen to or attach this widget to a form input";
				}
				for (x = 0; x < o.fieldList.length; x += 1) {
					field	= o.fieldList[x];
					this._bindValidationStartEvent(field);
					this._bindValidationFailedEvent(field);
					this._bindErrorEvent(field);
					this._bindClearEvent(field);
				}
			},
			/**
			 * Bind the validation failed event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindValidationFailedEvent: function (element) {
				element.bind(FormEvents.validation.failed, $.proxy(this, "handleValidationFailedEvent"));
			},
			/**
			 * Bind the clear event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindValidationStartEvent: function (element) {
				element.bind(FormEvents.validation.start, $.proxy(this, "handleValidationStartEvent"));
			},
			/**
			 * Bind the error event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindErrorEvent: function (element) {
				element.bind(FormEvents.error, $.proxy(this, "handleErrorEvent"));
			},
			/**
			 * Bind the clear event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindClearEvent: function (element) {
				element.bind(FormEvents.element.clear, $.proxy(this, "handleClearEvent"));
			},
			/**
			 * Function to react to the form.error event.
			 *
			 * @param {jQuery.Event} event
			 * @param {string} error
			 */
			handleErrorEvent: function (event, error) {},
			/**
			 * Function to react to the form.error.clear event.
			 *
			 * @param {jQuery.Event} event
			 */
			handleValidationStartEvent: function (event) {},
			/**
			 * Function to react to the form.error.clear event.
			 *
			 * @param {jQuery.Event} event
			 * @param {jQuery.Event} errorCode
			 */
			handleValidationFailedEvent: function (event, errorCode) {},
			/**
			 * Function to react to the form.clear event.
			 *
			 * @param {Object} event - event string
			 */
			handleClearEvent: function (event) {}
		});
	});
}(jQuery, cjaf));