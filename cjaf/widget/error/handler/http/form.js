/**
 * This is an HTTP error handler that is meant to be attached to a form widget.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/error/handler/http/form', [
		'cjaf/widget/helper/event',
		'cjaf/widget/error/handler/http'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 */
	function (EventHelper) {
		$.widget('cjaf.error_handler_http_form', $.cjaf.error_handler_http, {
			/**
			 * This is the default error handler.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"defaultHandler": function (event, XMLHttpRequest) {
				var response_code	= XMLHttpRequest.status;
				$.error('Form Error Received: ' + response_code + ' - ' + XMLHttpRequest.statusText);
				$.error(arguments);
				this.element.trigger(EventHelper.error, ['unknown_error']);
			},
			/**
			 * Handle a server side processing failure.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleProcessingFailedError": function (event, XMLHttpRequest) {
				var response	= $.parseJSON(XMLHttpRequest.responseText),
				index;
				
				for (index = 0; index < response.errors.length; index += 1) {
					this.element.trigger(EventHelper.error, [response.errors[index]]);
				}
				return false;
			},
			/**
			 * Handle a form validation event from the server.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleValidationFailedError": function (event, XMLHttpRequest) {
				var response	= $.parseJSON(XMLHttpRequest.responseText),
				this_el			= this.element,
				fields, input_name, el, index, errors, selector;
				
				if (response.hasOwnProperty('validation_errors')) {
					fields	= response.validation_errors;
				}
				if (fields) {
					for (input_name in fields) {
						if (!fields.hasOwnProperty(input_name)) {
							continue;
						}
						
						errors	= fields[input_name];
						selector	= '[name="' + input_name + '"]';
						
						if (errors.length > 0) {
							el	= this_el.find(selector);
							
							for (index = 0; index < errors.length; index += 1) {
								el.trigger(EventHelper.validation.failed, errors[index]);
							}
						}
					}
					
				}
				this_el.trigger(EventHelper.validation.failed);
				return false;
			},
			/**
			 * Handle someone's account being locked out.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleAccountLockedError": function (event, XMLHttpRequest) {
				this.element.trigger(EventHelper.error, ['account_locked']);
				return false;
			},
			/**
			 * Handle an authentication failure.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleAuthenticationFailedError": function (event, XMLHttpRequest) {
				this.element.trigger(EventHelper.error, ['authentication_failed']);
				return false;
			},
			/**
			 * Handle an internal server error event.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleInternalServerError": function (event, XMLHttpRequest) {
				var response	= $.parseJSON(XMLHttpRequest.responseText),
				error_code		= 'unknown_error';
				
				if (response.hasOwnProperty('error_message') && response.error_message) {
					error_code	= response.error_message;
				}
				this.element.trigger(EventHelper.error, [error_code]);
				return false;
			}
		});
	});
}(jQuery, cjaf));