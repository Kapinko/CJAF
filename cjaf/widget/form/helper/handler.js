/**
 * This is a form helper that assists in form event handling
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/helper/handler', [
		'cjaf/widget/form/helper',
		'cjaf/widget/form/helper/event',
		'cjaf/widget/helper/event',
		'cjaf/widget/error/handler/http/form'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper} FormHelper
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 * @param {cjaf.Widget.Event} WidgetEventHelper
	 * @return {cjaf.Widget.Form.Helper.Handler}
	 */
	function (FormHelper, EventHelper, WidgetEventHelper) {
		/**
		 * This is an object that handles all of the form events.
		 * @param {jQuery} form
		 * @constructor
		 */
		FormHelper.Handler	= function (form) {
			if (!form.is('form')) {
				throw "You must provide a form widget to the form UI helper.";
			}
			
			/**
			 * This is the form we are working with.
			 * @type {jQuery}
			 */
			this.form	= form;
			
			form.bind(EventHelper.validation.success, $.proxy(this, "handleValidationSuccess"));
			form.bind(EventHelper.validation.failed, $.proxy(this, "handleValidationFailure"));
			form.error_handler_http_form();
		};
		FormHelper.Handler.prototype	= {
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
			 * Handle a successful form submission.
			 * @param {Object.<string,*>} status
			 * @param {string} error
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleSuccess": function (response, status, XMLHttpRequest) { 
				return false;
			},
			/**
			 * Handle a failed form submission
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @param {string} status
			 * @param {string} error
			 * @return {boolean}
			 */
			"handleError": function (XMLHttpRequest, status, error) { 
				return false;
			},
			/**
			 * Handler to handle when the form validation is successful.
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			"handleValidationSuccess": function (event) {
				var self	= this,
				form		= this.form,
				success, error;
				
				success	= function () {
					form.trigger(EventHelper.success);
					return self.handleSuccess.apply(self, arguments);
				};
				error	= function () {
					return self._internalErrorHandler.apply(self, arguments);
				};
				
				form.trigger(EventHelper.submit.server);
				
				this.runAjaxCall(success, error);
				return false;
			},
			/**
			 * Handler to handle the form validation failure event.
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			"handleValidationFailure": function (event) { 
				return false;
			},
			/**
			 * Handle the validation success event for an element of this form.
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			"handleElementValidationSuccess": function (event) { 
				return false;
			},
			/**
			 * Handle the validation failure event for an element of this form.
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			"handleElementValidationFailure": function (event) { 
				return false;
			},
			/**
			 * This function will properly direct the handling of an error from
			 * the server.
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @param {string} status
			 * @param {Object} error
			 * @return {boolean}
			 */
			_internalErrorHandler: function (XMLHttpRequest, status, error) {
				var response_code	= XMLHttpRequest.status;
				
				if (response_code > 399) {
					this.form.trigger(WidgetEventHelper.error.http, XMLHttpRequest);
				}
				this.handleError.apply(this, arguments);
				
				return false;
			}
		};
		
		return FormHelper.Handler;
	});
}(jQuery, cjaf));