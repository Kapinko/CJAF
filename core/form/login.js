(function($,stax){
	stax.define('sodexo/card_holder/widget/form/login', [
		'i18n!nls/form.login.js',
		'cjaf/widget/form',
		'stax/widget/captcha',
		'stax/widget/form/listener/error_message',
		'jQuery/jquery.reload',
		'jQuery/jquery.auth',
		'lib/validator/not_empty'
	],
	/**
	 * @param {Object} locale
	 * @param {FormEvents} FormEvents
	 */
	function(locale, FormEvents){
		locale	= locale.form.login;
		/**
		 * The default captcha timeout interval.
		 * @type {number}
		 */
		var TIMEOUT_INTERVAL	= (20 * 60 * 1000);

		$.widget('stax.card_holder_form_login', $.stax.form, {
			options: {
				initViewPath: '/js/sodexo/card_holder/view/form/login/init.ejs',
				captchaTimeout: TIMEOUT_INTERVAL,
				usernameSelector: '#username',
				passwordSelector: '#password',
				captchaSelector: '#captcha',
				captchaImageSelector: '#captcha-image-container',
				errorLocale: locale.error,
				loggedInRedirector: function(){
					$.Auth('redirect');
				}
			},
			_create: function(){
				var o		= this.options;

				this.element.html(
					view(o.initViewPath, {locale:locale})
				);

				this.bindSubmitTrigger($('#login-submit'), {iconPrimary: 'ui-icon-star'});

				this.getCaptchaImage().captcha({
					timeout: o.captchaTimeout
				});

				//Attach the error message listener.
				$('#container-form-error-message').form_listener_error_message({
					form: this.element
				});

				//Call the parent create function.
				$.stax.form.prototype._create.apply(this, arguments);
			},
			/**
			 * Set up all the elements for this form.
			 */
			_initFormElements: function(){
				var username	= this.getUsername(),
					password	= this.getPassword(),
					captcha		= this.getCaptcha();

				username.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: locale.username.error
				});
				this.addElement(username);

				password.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: locale.password.error
				});
				this.addElement(password);

				captcha.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: locale.captcha.input.error
				});
				this.addElement(captcha);

			},
			/**
			 * Submit the form data to the server.
			 *
			 * @param {function()} success
			 * @param {function()} error
			 */
			runAjaxCall: function(success, error){
				var credentials	= new $.Auth.Credentials(
						this.getUsername().val(),
						this.getPassword().val(),
						this.getCaptcha().val()
				);
				$.Auth('login', credentials, success, error);
			},
			/**
			 * @param {Object} response
			 * @param {string} status
			 * @param {xmlHttpRequest} xmlHttpRequest
			 */
			handleSuccess: function(response, status, xmlHttpRequest){
				this.options.loggedInRedirector();
			},
			/**
			 * @param {XMLHttpRequest} xmlHttpRequest
			 * @param {string} status
			 * @param {string} error
			 */
			handleError: function(XMLHttpRequest, status, error){
				var response_code	= XMLHttpRequest.status;

				switch(response_code){
					case 500: {

						if($.Auth('isLoggedIn')){
							$.Auth('redirect');
						} else {
							this.getForm().trigger(FormEvents.error, XMLHttpRequest.responseText);
						}
						break;
					}
					default: {
						this.getForm().trigger(FormEvents.error, XMLHttpRequest.responseText);
					}
				}
			},
			/**
			 * @return {jQuery}
			 */
			getUsername: function(){
				return this.element.find(this.options.usernameSelector);
			},
			/**
			 * @return {jQuery}
			 */
			getPassword: function(){
				return this.element.find(this.options.passwordSelector);
			},
			/**
			 * @return {jQuery}
			 */
			getCaptcha: function(){
				return this.element.find(this.options.captchaSelector);
			},
			/**
			 * @return {jQuery}
			 */
			getCaptchaImage: function(){
				return this.element.find(this.options.captchaImageSelector);
			}
		});
	});
})(jQuery, stax);