/**
 * This is the helper that will handle the login form events.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define('core/widget/form/login/helper/handler', [
		'cjaf/widget/form/helper/handler',
		'lib/jquery/jquery.auth'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Handler} BaseHandler
	 */
	function (BaseHandler) {
		var Handler	= cjaf.Class.extend(BaseHandler, {
			/**
			 * @param {Object} response
			 * @param {string} status
			 * @param {xmlHttpRequest} xmlHttpRequest
			 */
			"handleSuccess": function (response, status, xmlHttpRequest) {
				this.options.loggedInRedirector();
			},
			/**
			 * @param {XMLHttpRequest} xmlHttpRequest
			 * @param {string} status
			 * @param {string} error
			 */
			"handleError": function (XMLHttpRequest, status, error) {
				var response_code	= XMLHttpRequest.status;

				if (response_code === 500) {
					if ($.Auth('isLoggedIn')) {
						$.Auth('redirect');
					} else {
						this.form.trigger(FormEvents.error, XMLHttpRequest.responseText);
					}
				} else {
					this.form.trigger(FormEvents.error, XMLHttpRequest.responseText);
				}
			},

			/**
			 * Set the function to handle user logged in re-direction.
			 * @param {function()} handler
			 */
			"setLoggedInHandler": function (handler) {
				this.loggedInHandler	= handler;
			}
		});

		return Handler;
	});
}(jQuery, cjaf));