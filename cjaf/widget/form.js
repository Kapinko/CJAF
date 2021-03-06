/**
 * This is an abstract form object meant to represent an HTML form.
 */
/** JSLint Declarations */
/*global jQuery:false, cjaf:false*/
/*jslint nomen: false */

(function ($, cjaf) {
	cjaf.define("cjaf/widget/form", [
		'cjaf/global',
		'cjaf/widget/form/helper/ui',
		'cjaf/widget/form/helper/handler',
		'cjaf/widget/form/helper/trigger',
		'lib/jquery/jquery.log',
		'lib/jquery/jquery.translate'
	],
	/**
	 * @param {cjaf.Global} Global
	 * @param {cjaf.Widget.Form.Helper.UI} UIHelper
	 * @param {cjaf.Widget.Form.Helper.Handler} HandlerHelper
	 * @param {cjaf.Widget.Form.Helper.Trigger} TriggerHelper
	 */
	function (Global, UIHelper, HandlerHelper, TriggerHelper) {
		var DISABLE_CLIENT_SIDE_VALIDATION	= "cjaf.disableClientSideValidation";
		
		$.widget('cjaf.form', {
			/**
			 * These are the available options for this widget
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This should be set to the jQuery object that will trigger a 
				 * form submit.
				 * @type {jQuery}
				 */
				"submitTrigger": null,
				/**
				 * This should be set to the jQuery object that will trigger a
				 * form clear/reset
				 * @type {jQuery}
				 */
				"clearTrigger": null,
				/**
				 * This object will be passed to the submit trigger as a set of
				 * options.
				 * @type {Object.<string,*>}
				 */
				"submitTriggerOptions": {},
				/**
				 * This object will be passed to the clear trigger as a set of
				 * options.
				 * @type {Object.<string,*>}
				 */
				"clearTriggerOptions": {},
				/**
				 * Should we only show one error per field?
				 * @type {boolean}
				 */
				"singleErrorPerField": true,
				/**
				 * This object will be used as the error locale string lookup
				 * object.
				 * @type {Object.<string,*>}
				 */
				"errorLocale": null,
				/**
				 * This can be used to disable the client side validation 
				 * programmatically.  Normally this is handled through a 
				 * cookie.
				 */
				"disableClientSideValidation": false,
				/**
				 * Get the UIHelper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.UI}
				 */
				"ui": UIHelper,
				/**
				 * Get the event handler helper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Handler}
				 */
				"eventHandler": HandlerHelper,
				/**
				 * Get the event trigger helper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Trigger}
				 */
				"eventTrigger": TriggerHelper
			},
			/**
			 * Form widget initialization.
			 */
			"_create": function () {
				if (!this.element.is('form')) {
					throw "You must attach this form widget to a HTML form element.";
				}
				
				var el	= this.element,
				o		= this.options;
				
				/**
				 * This is the user interface helper for this form widget.
				 * @type {cjaf.Widget.Form.Helper.UI}
				 */
				this.ui	= new o.ui(el, this.widgetName);

				if (!(this.ui instanceof UIHelper)) {
					throw "Given form UI helper must be an instance of cjaf.Widget.Form.Helper.UI.";
				}

				/**
				 * This is the event handler helper for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Handler}
				 */
				this.handler	= new o.eventHandler(el, this.widgetName);

				if (!(this.handler instanceof HandlerHelper)) {
					throw "Given form event handler must be an instance of cjaf.Widget.Form.Helper.Handler.";
				}

				/**
				 * This is the event trigger helper for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Trigger}
				 */
				this.trigger	= new o.eventTrigger(el, this.widgetName);

				if (!(this.trigger instanceof TriggerHelper)) {
					throw "Given form event trigger helper must be an instance of cjaf.Widget.Form.Helper.Trigger.";
				}

				if (o.hasOwnProperty('errorLocale')) {
					el.translate({"locale": o.errorLocale});
				}

				if (o.hasOwnProperty('submitTrigger')) {
					this.trigger.bindSubmit($(o.submitTrigger), o.submitTriggerOptions);
				}

				if (o.hasOwnProperty('clearTrigger')) {
					this.trigger.bindClear($(o.clearTrigger), o.clearTriggerOptions);
				}

				this.initFormElements(this.ui, this._getLocale());
			},
			/**
			 * This function should add all of the necessary elements
			 * to this form.
			 * @type {function(cjaf.Widget.Form.Helper.UI)}
			 */
			"initFormElements": function (form_ui, form_locale) {
				throw "You must provide a initFormElements function.";
			},
			/**
			 * This method is called upon a successful form validation.
			 * @param {function():boolean} success
			 * @param {function():boolean} error
			 * @return {boolean}
			 */
			"runAjaxCall": function (success, error) {
				return  false;
			},
			/**
			 * Submit this form
			 * @return {boolean}
			 */
			"submit": function () {
				this.trigger.submitClient();

				if (this._isClientSideValidationDisabled() || this.isValid()) {
					this.trigger.validationSuccess();
				} else {
					this.trigger.validationFailure();
				}
				return false;
			},
			/**
			 * Validate the information in this form.
			 * @return {boolean}
			 */
			"isValid": function () {
				var is_valid	= true,
				element_list	= this.ui.getElementList(), i;


				for (i = 0; i < element_list.length; i += 1) {
					is_valid	= element_list[i].form_element('isValid') ? is_valid : false;
				}
				return is_valid;
			},
			/**
			 * Clear this form.
			 * @return {jQuery}
			 */
			"clear": function () {
				return this.reset();
			},
			/**
			 * Reset this form (clear element values)
			 * @return {jQuery}
			 */
			"reset": function () {
				return this.trigger.reset();
			},
			/**
			 * Get the user intface helper for this form widget.
			 * @return {cjaf.Widget.Form.Helper.UI}
			 */
			"getUIHelper": function () {
				return this.ui;
			},
			/**
			 * Get the event handler helper for this form widget.
			 * @return {cjaf.Widget.Form.Helper.Handler}
			 */
			"getEventHandler": function () {
				return this.handler;
			},
			/**
			 * Get the event trigger helper for this form widget.
			 * @return {cjaf.Widget.Form.Helper.Trigger}
			 */
			"getTriggerHandler": function () {
				return this.trigger;
			},
			/**
			 * Has the client side validation been disabled?
			 * @return {boolean}
			 */
			_isClientSideValidationDisabled: function () {
				var flag	= this.options.hasOwnProperty("disableClientSideValidation") ? this.options.disableClientSideValidation : null;

				if (typeof flag === null) {
					flag	= ($.cookie(DISABLE_CLIENT_SIDE_VALIDATION)) ? true : false;
				}

				if (flag) {
					$.logNotify('CLIENT SIDE VALIDATION HAS BEEN DISABLED');
				}

				return flag;
			},
			/**
			 * Get the locale object for this form.
			 * @return {Object.<string,*>}
			 */
			_getLocale: function () {
				var locale = null;

				//If the user has not turned off the locale lookup.
				if (!this.options.no_locale) {
					//Load the default if a custom locale name is not specified.
					if (!this.options.locale) {
						locale	= Global.localize(this.widgetName);
					} else {
						locale	= Global.localize(this.options.locale);
					}
				}
				return locale;
			}
		});
	});
}(jQuery, cjaf));