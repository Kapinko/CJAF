/**
 * This is an abstract form object meant to represent an HTML form.
 */
/** JSLint Declarations */
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("cjaf/widget/form", [
		"cjaf/widget/form/helper/event"
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 */
	function (EventHelper) {
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
				"disableClientSideValidation": true
			},
			/**
			 * Form widget initialization.
			 */
			"_create": function () {
				var self	= this,
					form, errorLocale;
				/**
				 * @type {Array.<jQuery>}
				 */
				this.element_list	= new Array();
				
				if (!this.element.is('form')) {
					throw "You must attach this form widget to a HTML form element.";
				}
				
				form	= this.getForm();
				form.attr('action', 'javascript:;')
					.attr('method', 'POST')
					.addClass('ui-widget-content ui-corner-all')
					
				form.bind(EventHelper.validation.success, $.proxy(this, "_handleValidationSuccess"));
				form.bind(EventHelper.validation.failed, $.proxy(this, "_handleValidationError"));
				
				if (this.options.hasOwnProperty('errorLocale')) {
					form.translate({"locale": this.options.errorLocale});
				}
				
				this._initFormElements();
			},
			/**
			 * Initialize the elements that are part of this form.
			 * @return {Array.<jQuery>}
			 */
			"_initFormElements": function () {
				throw "You must override the \"_initFormElements\" method.";
			},
			/**
			 * Add an element to this form.
			 * @param {jQuery} element
			 */
			"addElement": function (element) {
				element.form_element('setForm', this.getForm());
				this.element.push(element);
				
				element.bind(EventHelper.validation.failed, $.proxy(this, "handleElementValidationFailure"));
				element.bind(EventHelper.validation.success, $.proxy(this, "handleElementValidationSuccess"));
				
				return this;
			},
			/**
			 * Submit the form data to the server.
			 * @param {function()} success
			 * @param {function()} error
			 */
			"runAjaxCall": function (success, error) {},
			/**
			 * Handle a successful form submission.
			 * @param {Object} response
			 * @param {string} status
			 * @param {XMLHttpRequest} XMLHttpRequest
			 */
			"handleSuccess": function (response, status, error) {},
			/**
			 * Handle a failed form submission.
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @param {string}
			 * @param {string}
			 */
			"handleError": function (XMLHttpRequest, status, error) {},
			 /**
			  * Handler to handle when the form validation is successful.
			  * @param {jQuery.Event} event
			  */
			 "handleValidationSuccess": function (event) {
				 var self	= this,
				 form		= this.getForm(),
				 success, error;
				 
				 success	= function () {
					 form.trigger(EventHelper.success);
					 return self.handleSuccess.apply(self, arguments);
				 };
				 
				 form.trigger(EventHelper.submit.server);
				 
				 this.runAjaxCall(success, error);
				 return false;
			 },
			 /**
			  * Handle the validation success event for an element of this form.
			  * @param {jQuery.Event}
			  * @return {boolean}
			  */
			 "handleElementValidationSuccess": function (event) {return false;},
			 /**
			  * Handle the validation failure event for an element of this form.
			  * @param {jQuery.Event}
			  * @return {boolean}
			  */
			 "handleElementValidationFailure": function (event) {return false;},
			 /**
			  * Handler to handle the form validation failure event.
			  * @param {jQuery.Event} event
			  * @return {boolean}
			  */
			 "handleValidationFailure": function (event) {return false;},
			 /**
			  * Submit this form
			  * @return {boolean}
			  */
			 "submit": function () {
				 var form	= this.getForm();
				 
				 form.trigger(EventHelper.submit.client);
				 
				 if (this._clientSideValidationDisabled() || this.isValid()) {
					 form.trigger(EventHelper.validation.success);
				 } else {
					 form.trigger(EventHelper.validation.failed);
				 }
				 return false;
			 },
			 /**
			  * Validate the information in this form.
			  * @return {boolean}
			  */
			 "isValid": function () {
				 var is_valid	= true, i;
				 
				 for(var i = 0; i < this.element_list.length; i += 1) {
					 is_valid	= this.element_list[i].form_element('isValid') ? is_valid : false;
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
				 var form	= this.getForm();
				 form.trigger(EventHelper.clear);
				 return form;
			 },
			 /**
			  * Bind the submit trigger click event to the submit function.
			  * @param {jQuery} trigger
			  * @param {Object.<string, *>} options
			  * @return {jQuery}
			  */
			 "bindSubmitTrigger": function (trigger, options) {
				 var el			= this.element;
				 
				 if (trigger.is(':button, :input[type="submit"]')) {
					 options	= $.extend(options, {form: el});
					 trigger.submit_with_spinner(options);
				 }
				 
				 trigger.click($.proxy(this, "submit"));
				 
				 return el;
			 },
			 /**
			  * Bind a clear form trigger.
			  * @param {jQuery} trigger
			  * @param {Object.<string,*>}
			  * @return {jQuery}
			  */
			 "bindClearTrigger": function (trigger, options) {
				 var el		= this.element,
				 primary	= null,
				 secondary	= null, button_options;
				 
				 if (trigger.is(':button, :input[type="submit"]')) {
					 options	= $.extend(options, {form: el});
					 
					 if (options.hasOwnProperty("iconPrimary")) {
						 primary	= options.iconPrimary;
					 }
					 if (options.hasOwnProperty("iconSecondary")) {
						 secondary	= options.iconSecondary;
					 }
					 
					 button_options	= {
						 "icons": {
							 "primary": primary,
							 "secondary": secondary
						 }
					 };
					 trigger.button(button_options);
				 }
				 trigger.click($.proxy(this, "clear"));
				 
				 return el;
			 },
			 /**
			  * This function will properly direct the handling of an error
			  * being returned from the server.
			  * @param {XMLHttpRequest} XMLHttpRequest
			  * @param {string} textStatus
			  * @param {Object} errorThrown
			  * @return {boolean}
			  */
			 _internalErrorHandler: function (XMLHttpRequest, textStatus, errorThrown) {
				 var response_code	= XMLHttpRequest.status;
				 
				 //If the response code is an HTTP Error
				 if (response_code > 399) {
					 //@todo figure out a way to get this error, don't really like the 
					 // event factory.
					 this.getForm().trigger("cjaf_error_http", XMLHttpRequest);
				 }
				 this.handleError.apply(this, arguments);
				 
				 return false;
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
			 }
		});
	});
}(jQuery, cjaf));