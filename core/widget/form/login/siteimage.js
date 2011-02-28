/**
 * This is a widget to enable to user to log in with a site image
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/form/login/siteimage", [
		"core/widget/form/login/helper/handler",
		"cjaf/widget/form/helper/ui",
		"cjaf/widget/form",
		"cjaf/widget/form/element",
		"cjaf/widget/form/listener/error_message",
		"lib/jquery/jquery.auth",
		"lib/validator/not_empty"
	],
	/**
	 * @param {HandlerHelper} HandlerHelper
	 * @param {cjaf.Widget.Form.Helper.UI} UIHelper
	 */
	function (HandlerHelper, UIHelper) {
		$.widget("cjaf.core_form_login_siteimage", $.cjaf.form, {
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
				 * Get the UIHelper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.UI}
				 */
				"ui": cjaf.Class.extend(UIHelper, {
					"getElementList": function () {
						var filtered	= [],
						unfiltered		= this.element_list, index;

						for (index = 0; index < unfiltered.length; index += 1) {
							if (unfiltered[index].is(":visible")) {
								filtered.push(unfiltered[index]);
							}
						}

						return filtered;
					}
				}),
				/**
				 * This is the jQuery selector that will be used to retrieve the
				 * submit button element.
				 * @type {string}
				 */
				"submitTrigger": ".form-submit-login",
				/**
				 * These are the options that will be sent to the submit trigger
				 * bind method.
				 * @type {Object.<string,*>}
				 */
				"submitTriggerOptions": {
					"iconPrimary": "ui-icon-star",
					"processingImageUrl": "/img/loading/ajax-arrows.gif"
				},
				/**
				 * These are the form steps in the order that they should be
				 * processed.
				 * @type {Array.<string>}
				 */
				"steps": [
					"fieldset.username",
					"fieldset.secret",
					"fieldset.password"
				],
				/**
				 * This is the step we're currnetly on.
				 * @type {number}
				 */
				"currentStep": 0
			},

			_create: function () {
				var o	= this.options,
				el		= this.element;
				
				this.credentials	= new $.Auth.Credentials();


				el.html(this._view({}));

				this.getCurrentStep().fadeIn();

				$.cjaf.form.prototype._create.apply(this, arguments);

				this.handler.setLoggedInHandler($.proxy(function () {
					if (!this.hasNextStep()) {
						this.options.loggedInRedirector();
					}
				}, this));
			},
			/**
			 * Ste up all the elements for this form.
			 * @param {cjaf.Widget.Helper.Form.UI} form_ui
			 * @param {Object.<string,*>} form_locale
			 */
			initFormElements: function (form_ui, form_locale) {
				var username	= this.getUsername(),
				password		= this.getPassword(),
				answer			= this.getAnswer(),
				locale			= form_locale.errors;

				username.form_element({
					validators: [
						{type: "NotEmpty", options: {}}
					],
					errorLocale: locale.username
				});
				form_ui.addElement(username);

				password.form_element({
					validators: [
						{type: "NotEmpty", options: {}}
					],
					errorLocale: locale.password
				});
				form_ui.addElement(password);

				answer.form_element({
					validators: [
						{type: "NotEmpty", options: {}}
					],
					errorLocale: locale.answer
				});
				form_ui.addElement(answer);
			},
			/**
			 * Submit the form data to the server
			 *
			 * @param {function()} success
			 * @param {function()} error
			 */
			runAjaxCall: function (success, error) {
				var credentials;
				
				if (this.hasNextStep()) {
					this.getCurrentStep().effect("slide", {"mode": "hide", "direction": "left"}, $.proxy(function () {
						this.getNextStep().effect("slide", {"mode": "show", "direction": "right"});
					}, this));
					success();
				} else {
					/*credentials	= new $.Auth.Credentials(
						this.getUsername().val(),
						this.getPassword().val(),
						"Security Code"
					);

					$.Auth('login', credentials, success, error);*/
					success();
				}
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
			},
			/**
			 * Get the current step
			 * @return {jQuery}
			 */
			getCurrentStep: function () {
				var o		= this.options,
				selector	= o.steps[o.currentStep];

				return this.element.find(selector);
			},
			/**
			 * Get the previous step
			 * @return {jQuery}
			 */
			getPreviousStep: function () {
				if (this.hasPreviousStep()) {
					this.options.currentStep -= 1;
				}
				return this.getCurrentStep();
			},
			/**
			 * Get the next step
			 * @return {jQuery}
			 */
			getNextStep: function () {
				if (this.hasNextStep()) {
					this.options.currentStep += 1;
				}
				return this.getCurrentStep();
			},
			/**
			 * Are there any more steps?
			 * @return {boolean}
			 */
			hasNextStep: function () {
				var o	= this.options;
				return o.steps.length > o.currentStep + 1 ? true :false;
			},
			/**
			 * Is this the 1st step?
			 * @return {boolean}
			 */
			hasPreviousStep: function () {
				return this.options.currentStep > 0 ? true : false;
			}
		});
	});
}(jQuery, cjaf));