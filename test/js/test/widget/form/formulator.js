/**
 * This is the page controller for the CJAF Test Framework index page.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false, window: false*/
/*jslint nomen:false*/
(function ($, cjaf, setTimeout) {
	cjaf.define('test/widget/form/formulator', [
		'cjaf/widget/form/helper/handler',
		'cjaf/widget/form',
		'cjaf/widget/form/listener/element_error_proxy',
		'cjaf/widget/form/element',
		'lib/validator/not_empty',
		'lib/validator/length',
		'lib/validator/integer',
		'lib/validator/match',
		'lib/validator/maximum_length',
		'lib/validator/name',
		'lib/validator/not_equal',
		'lib/validator/number',
		'lib/validator/regex',
		'lib/validator/minimum_length',
		'lib/validator/email',
		'lib/jquery/jquery.maskedinput'
	],
	function (EventHandler) {
		$.widget('cjaf.test_form_formulator', $.cjaf.form,  {
			/**
			 * These are the available options and their defaults for this
			 * widget.
			 * @type {Object.<string, *>}
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
				 * Get the event handler helper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Handler}
				 */
				"eventHandler": cjaf.Class.extend(EventHandler, {
					"runAjaxCall": function (success, error) {
						setTimeout(success, 1000);
						return false;
					}
				})
			},
			/**
			 * The initialization function for this widget.
			 */
			_create: function () {
				var o	= this.options;
				
				this.element.html(this._view({}));

				o.submitTrigger	= this._getSubmitButton();

				$.cjaf.form.prototype._create.apply(this, arguments);
			},
			/**
			 * This function should add all of the necessary elements
			 * to this form.
			 * @type {function(cjaf.Widget.Form.Helper.UI, Object.<string,*>)}
			 */
			"initFormElements": function (form_ui, form_locale) {
				var addr1	= this._getAddressLine1(),
				addr2	= this._getAddressLine2(),
				city	= this._getCity(),
				state	= this._getState(),
				zip		= this._getZip(),
				email	= this._getEmail(),
				homep	= this._getPhoneHome(),
				mobile	= this._getPhoneCell(),
				locale	= form_locale.form.information;

				addr1.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: locale.address1.error,
					errorListVisible: false
				});
				form_ui.addElement(addr1);

				addr2.form_element({
					validators: [

					],
					errorLocale: locale.address2.error,
					errorListVisible: false
				});
				form_ui.addElement(addr2);

				city.form_element({
					validators: [
						{type: 'NotEmpty', options: {}},
						{type: 'Length', options: {maximumLength: 26}},
						{type: 'Regex', options: {regex: /^[A-Za-z][A-Za-z \-\']*[A-Za-z]$/}}
					],
					errorLocale: locale.city.error,
					errorListVisible: false
				});
				form_ui.addElement(city);

				//state.selectmenu({width:60, style:'dropdown', maxHeight: 100});

				state.form_element({
					validators: [
						{type: 'NotEmpty', options: {}}
					],
					errorLocale: locale.state.error,
					errorListVisible: false
				});
				form_ui.addElement(state);


				zip.form_element({
					validators: [
						{type: 'NotEmpty', options: {}},
						{type: 'MinimumLength', options: {'minimumLength': 5}},
						{type: 'Number', options: {}}
					],
					errorLocale: locale.zip.error,
					errorListVisible: false
				});
				form_ui.addElement(zip);

				email.form_element({
					validators: [
						{type: 'NotEmpty', options: {}},
						{type: 'Email', options: {}}
					],
					errorLocale: locale.email.error,
					errorListVisible: false
				});
				form_ui.addElement(email);

				homep.form_element({
					validators: [
						{'type': 'Length', 'options': {'minimumLength': 10, 'allowEmpty': true}}

					],
					errorLocale: locale.homephone.error,
					errorListVisible: false
				});
				homep.mask('(999) 999-9999', {placeholder: " "});
				form_ui.addElement(homep);

				mobile.form_element({
					validators: [
						{'type': 'Length', 'options': {'minimumLength': 10, 'allowEmpty': true}}
					],
					errorLocale: locale.cellphone.error,
					errorListVisible: false
				});
				mobile.mask('(999) 999-9999', {placeholder: " "});
				form_ui.addElement(mobile);


				this.element.find('.container-form-error-message').form_listener_element_error_proxy({
					form: this.element,
					fieldList: [addr1, addr2, city, state, zip, email, homep, mobile]
				});
			},
			
			_getAddressLine1: function () {
				return this.element.find('#address-1');
			},
			/**
			 * @return {jQuery}
			 */
			_getAddressLine2: function () {
				return this.element.find('#address-2');
			},
			/**
			 * @return {jQuery}
			 */
			_getCity: function () {
				return this.element.find('#city');
			},
			/**
			 * @return {jQuery}
			 */
			_getState: function () {
				return this.element.find('#state');
			},
			/**
			 * @return {jQuery}
			 */
			_getZip: function () {
				return this.element.find('#zip');
			},
			/**
			 * @return {jQuery}
			 */
			_getEmail: function () {
				return this.element.find('#email');
			},
			/**
			 * @return {jQuery}
			 */
			_getPhoneHome: function () {
				return this.element.find('#phone-home');
			},
			/**
			 * @return {jQuery}
			 */
			_getPhoneCell: function () {
				return this.element.find('#phone-cell');
			},
			/**
			 * @return {jQuery}
			 */
			_getSubmitButton: function () {
				return this.element.find('#information-submit');
			}

		});
	});
}(jQuery, cjaf, window.setTimeout));