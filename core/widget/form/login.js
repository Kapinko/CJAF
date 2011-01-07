/*jslint nomen:false*/
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('core/widget/form/login', [
		'core/widget/form/login/helper/handler',
		'cjaf/widget/form',
		'cjaf/widget/form/element',
		'cjaf/widget/form/listener/error_message',
		'core/widget/captcha',
		'lib/jquery/jquery.auth',
		'lib/validator/not_empty'
	],
	/**
	 * @param {HandlerHelper} HandlerHelper
	 */
	function (HandlerHelper) {
		/**
		 * The default captcha timeout interval.
		 * @type {number}
		 */
		var TIMEOUT_INTERVAL	= (20 * 60 * 1000);

		$.widget('cjaf.core_form_login', $.cjaf.form, {
			options: {
				captchaTimeout: TIMEOUT_INTERVAL,
				usernameSelector: '#username',
				passwordSelector: '#password',
				captchaSelector: '#captcha',
				captchaImageSelector: '#captcha-image-container',
				/**
				 * This will be applied to the captcha image as it's
				 * src attribute
				 * @type {string}
				 */
				captchaSrc: '',
				loggedInRedirector: function () {
					$.Auth('redirect');
				},
				/**
				 * Get the event handler helper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Handler}
				 */
				"eventHandler": HandlerHelper,
				/**
				 * This is the jQuery selector for the object
				 * that will trigger a form submit.
				 * @type {string}
				 */
				"submitButton": '#form-submit-login',
				/**
				 * These are the options that will be sent to the submit trigger
				 * bind method.
				 * @type {Object.<string,*>}
				 */
				"submitTriggerOptions": {
					'iconPrimary': 'ui-icon-star'
				}

			},
			_create: function () {
				var o		= this.options;

				this.element.html(this._view({}));

				this.getCaptchaImage().core_captcha({
					timeout: o.captchaTimeout,
					view: {
						image: {
							src: this.options.captchaSrc
						}
					}
				});

				o.submitTrigger	= this.getSubmitButton();

				//Call the parent create function.
				$.cjaf.form.prototype._create.apply(this, arguments);

				this.handler.setLoggedInHandler(this.options.loggedInRedirector);
			},
			/**
			 * Set up all the elements for this form.
			 * @param {cjaf.Widget.Helper.Form.UI} form_ui
			 * @param {Object.<string,*>} form_locale
			 */
			initFormElements: function (form_ui, form_locale) {
				var username	= this.getUsername(),
					password	= this.getPassword(),
					captcha		= this.getCaptcha();

				username.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: form_locale.username.error
				});
				form_ui.addElement(username);

				password.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: form_locale.password.error
				});
				form_ui.addElement(password);

				captcha.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: form_locale.captcha.error
				});
				form_ui.addElement(captcha);

			},
			/**
			 * Submit the form data to the server.
			 *
			 * @param {function()} success
			 * @param {function()} error
			 */
			"runAjaxCall": function (success, error) {
				var form	= this.form,
				widget		= this.widget_name,
				credentials	= new $.Auth.Credentials(
						form[widget]('getUsername')..val(),
						this.getPassword().val(),
						this.getCaptcha().val()
				);
				$.Auth('login', credentials, success, error);
			},
			/**
			 * @return {jQuery}
			 */
			getUsername: function () {
				return this.element.find(this.options.usernameSelector);
			},
			/**
			 * @return {jQuery}
			 */
			getPassword: function () {
				return this.element.find(this.options.passwordSelector);
			},
			/**
			 * @return {jQuery}
			 */
			getCaptcha: function () {
				return this.element.find(this.options.captchaSelector);
			},
			/**
			 * @return {jQuery}
			 */
			getCaptchaImage: function () {
				return this.element.find(this.options.captchaImageSelector);
			},
			/**
			 * Get submit button
			 * @return {jQuery}
			 */
			getSubmitButton: function () {
				return this.element.find(this.options.submitButton);
			}
		});
	});
}(jQuery, cjaf));