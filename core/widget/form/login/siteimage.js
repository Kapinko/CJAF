/**
 * This is a widget to enable to user to log in with a site image
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/form/login/siteimage", [
		"core/widget/form/login/helper/handler",
		"cjaf/widget/form",
		"cjaf/widget/form/element",
		"cjaf/widget/form/listener/error_message",
		"lib/jquery/jquery.auth",
		"lib/validator/not_empty"
	],
	/**
	 * @param {HandlerHelper} HandlerHelper
	 */
	function (HandlerHelper) {
		$.widget("cjaf.core_form_login_siteimage", {
			options: {
				/**
				 * This is the jQuery selector that will be used to retrieve the
				 * user name input element.
				 * @type {string}
				 */
				"usernameSelector": "#username",
				/**
				 * This is the jQuery selector that will be used to retrieve the
				 * password input element
				 * @type {string}
				 */
				"passwordSelector": "#password",
				/**
				 * This is the jQuery selector that will be used to retrieve the
				 * answer input element
				 * @type {string}
				 */
				"answerSelector": "#answer",
				/**
				 * This is the jQuery selector that will be used to retrieve the
				 * help icon.
				 * @type {string}
				 */
				"helpSelector": "span.help",
				/**
				 * This is the function that will be used to redirect the user
				 * in the event of a successful login.
				 * @type {function}
				 */
				"loggedInRedirector": function () {
					$.Auth("redirect");
				},
				/**
				 * Get the event handler helper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Handler}
				 */
				"eventHandler": HandlerHelper,
				/**
				 * This is the jQuery selector that will be used to retrieve the
				 * submit button element.
				 * @type {string}
				 */
				"submitSelector": ".form-submit-login",
				/**
				 * These are the options that will be sent to the submit trigger
				 * bind method.
				 * @type {Object.<string,*>}
				 */
				"submitTriggerOptions": {
					"iconPrimary": "ui-icon-star",
					"processingImageUrl": "/img/loading/ajax-arrows.gif"
				}
			},

			_create: function () {
				var o	= this.options,
				el		= this.element;


				el.html(this._view({

				}));

				//turn the help span into a button
				this.getHelp().button({
					"icons": {
						"primary": "ui-icon-help"
					}
				});

				
			},
			/**
			 * Ste up all the elements for this form.
			 * @param {cjaf.Widget.Helper.Form.UI} form_ui
			 * @param {Object.<string,*>} form_locale
			 */
			initFormElements: function (form_ui, form_locale) {
				var username	= this.getUsername(),
				password		= this.getPassword(),
				answer			= this.getAnswer();

				username.form_element({
					valdiators: [
						{type: "NotEmpty", options: {}}
					]
				});
				form_ui.addElement(username);

				password.form_element({
					validators: [
						{type: "NotEmpty", options: {}}
					]
				});
				form_ui.form_element(password);

				answer.form_element({
					validators: [
						{type: "NotEmpty", options: {}}
					]
				});
				form_ui.form_element(answer);
			},
			/**
			 * Submit the form data to the server
			 *
			 * @param {function()} success
			 * @param {function()} error
			 */
			runAjaxCall: function (success, error) {

			},
			/**
			 * Get the username input element
			 * @return {jQuery}
			 */
			getUsername: function () {
				return this.element.find(this.options.usernameSelector);
			},
			/**
			 * Get the password input element
			 * @return {jQuery}
			 */
			getPassword: function () {
				return this.element.find(this.options.passwordSelector);
			},
			/**
			 * Get the answer input element
			 * @return {jQuery}
			 */
			getAnswer: function () {
				return this.element.find(this.options.answerSelector);
			},
			/**
			 * Get the submit button element
			 * @return {jQuery}
			 */
			getSubmitButton: function () {
				return this.element.find(this.options.submitSelector);
			},
			/**
			 * Get the help icon element.
			 * @return {jQuery}
			 */
			getHelp: function () {
				return this.element.find(this.options.helpSelector);
			}
		});
	});
}(jQuery, cjaf));