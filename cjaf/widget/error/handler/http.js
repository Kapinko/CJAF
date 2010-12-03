/**
 * This is a class that will handle HTTP errors and pass the error event off
 * to a handler function which then can be overridden.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false, alert: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/error/handler/http', [
		'cjaf/widget/helper/event'
	],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 */
	function (EventHelper) {
		$.widget('cjaf.error_handler_http', {
			/**
			 * Initialize the error handler widget.
			 */
			"_create": function () {
				this.element.bind(EventHelper.error.http, $.proxy(this, "handleError"));
			},
			/**
			 * Forward an HTTP error on the proper handler function.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleError": function (event, XMLHttpRequest) {
				var response_code	= XMLHttpRequest.status;
				
				switch (response_code) {
				case 491:
					this.handleExternalServiceFailedError.apply(this, arguments);
					break;
				case 492:
					this.handleAuthenticationFailedError.apply(this, arguments);
					break;
				case 493:
					this.handleAccountLockedError.apply(this, arguments);
					break;
				case 494:
					this.handleKBASetupRequiredError.apply(this, arguments);
					break;
				case 495:
					this.handleProcessingFailedError.apply(this, arguments);
					break;
				case 496:
					this.handleValidationFailedError.apply(this, arguments);
					break;
				case 497:
					this.handleAdditionalAuthenticationRequiredError.apply(this, arguments);
					break;
				case 498:
					this.handleSessionTimeoutError.apply(this, arguments);
					break;
				case 499:
					this.handleAccessDeniedError.appy(this, arguments);
					break;
				case 500:
					this.handleInternalServerError.apply(this, arguments);
					break;
				case 404:
					this.handleNotFoundError.apply(this, arguments);
					break;
				case 400:
					this.handleBadRequestError.apply(this, arguments);
					break;
				default: 
					this.handleUnknownError.apply(this, arguments);
				}
				return false;
			},
			/**
			 * The default error handler.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"defaultHandler": function (event, XMLHttpRequest) {
				var response_code	= XMLHttpRequest.status;
				
				alert('Error Received: ' + response_code + " &mdash; " + XMLHttpRequest.statusText);
				$.error(arguments);
				
				return false;
			},
			/**
			 * Handle an unknown error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleUnknownError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 400 - Bad Request error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleBadRequestError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 404 - Not Found error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleNotFoundError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 500 - Internal Server Error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleInternalServerError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 499 - Access Denied error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleAccessDeniedError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 498 - Session Timeout error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleSessionTimeoutError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 497 - Additional Authentication Required error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleAdditionalAuthenticationRequiredError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 496 Validation Failed error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleValidationFailedError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 495 -- Processing Failed error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleProcessingFailedError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 494 - KBA Setup Required error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleKBASetupRequiredError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 493 - Account Locked error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleAccountLockedError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 492 - Authentication Failed error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleAuthenticationFailedError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			},
			/**
			 * Handle a 491 - External Service Failed error.
			 * @param {jQuery.Event} event
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			"handleExternalServiceFailedError": function (event, XMLHttpRequest) {
				return this.defaultHandler.apply(this, arguments);
			}
		});
	});
}(jQuery, cjaf));