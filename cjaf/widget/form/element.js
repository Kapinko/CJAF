/**
 * This is a representation of a HTML form element.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define("cjaf/widget/form/element", [
		"cjaf/widget/form/helper/event",
		'cjaf/widget/form/element/listener/error_styling',
		"jQuery/jquery.translate"

	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 */
	function (EventHelper) {
		$.widget('cjaf.form_element', {
			/**
			 * These are the available options for this widget.
			 * @type {Object.<string,*>}
			 */
			"options": {
				/**
				 * This is the css class that will be applied to validation 
				 * error messages.
				 * @type {string}
				 */
				"errorClass": 'ui-state-error',
				/**
				 * This is the error string lookup object that will be passed
				 * to the translator.
				 * @type {Object.<string,*>}
				 */
				"errorLocale": null,
				/**
				 * Should the list of validation errors be visible for this
				 * element?
				 * @type {boolean}
				 */
				"errorListVisible": true,
				/**
				 * Where should we position the error list?
				 * @type {string} - one of 'append','prepend'
				 */
				"errorListPosition": 'append',
				/**
				 * At what level should we attach the error list.
				 * @type {string} - one of 'element' or 'parent'
				 */
				"errorListLevel": 'element',
				/**
				 * What should the target of the error list be?
				 * @type {string}
				 */
				"errorListTarget": 'self',
				/**
				 * What are the fields that this error list should listen to?
				 * @type {Array.<jQuery>}
				 */
				"errorListFields": [],
				/**
				 * What are the validators that we should use for this field?
				 * @type {Array.<*>}
				 */
				"validators": [],
				/**
				 * What class should be applied to this element when it
				 * receives focus?
				 * @type {string}
				 */
				"focusClass": 'ui-state-focus',
				/**
				 * What class should be applied to this element when it is
				 * hovered over?
				 * @type {string}
				 */
				"hoverClass": 'ui-state-highlight'
			},
			/**
			 * The identifier of this element
			 * @type {string}
			 */
			elementId: null,
			/**
			 * Create this element widget.
			 */
			"_create": function () {
				var o		= this.options, error_locale;
					
				this.elementId	= this.element.attr('id');
				
				this._initUIStyle();
				
				if (o.hasOwnProperty('errorLocale') && typeof o.errorLocale === 'object') {
					this.element.translate({"locale": o.errorLocale});
				}
				
				this._addErrorListeners();
				this.addValidators(this.options.validators);
			},
			/**
			 * Set the form element for this element.
			 * @param {jQuery} form
			 */
			"setForm": function (form) {
				this.options.form	= form;
				
				form.bind(EventHelper.submit.client, $.proxy(this, "_handleFormSubmit"));
				form.bind(EventHelper.clear, $.proxy(this, "_handleFormClear"));
				
				return this.element;
			},
			/**
			 * Check to see that the data contained in this form element is valid.
			 */
			"validate": function () {
				this.element.trigger(EventHelper.validation.start);
				this.element.validate();
			},
			/**
			 * Is the data contained in this form element valid?
			 * @return {boolean}
			 */
			"isValid": function () {
				this.element.trigger(EventHelper.validation.start);
				var result	= this.element.validate();
				return result.isValid();
			},
			/**
			 * Add a given set of validators to this form element.
			 * @param {Array.<*>} validators
			 * @return {jQuery}
			 */
			"addValidators": function (validators) {
				if ($.isArray(validators)) {
					for (var i = 0; i < validators.length; i += 1) {
						this.addValidator(validators[i].type, validators[i].options);
					}
				}
				return this.element;
			},
			/**
			 * Add a given validator with the given options to this form element.
			 * @param {$.validator} validator
			 * @param {Object.<string, *>} options
			 * @return {jQuery}
			 */
			"addValidator": function (validator, options) {
				var el		= this.element,
				elements	= el.find(':input'),
				validators	= cjaf.Validator, i, jQuery;
				
				if (el.is('input')) {
					elements.push(el);
				}
				if (typeof options === 'undefined') {
					options	= {};
				}
				
				for (i = 0; i < elements.length; i += 1) {
					if (typeof validators[validator] === 'function') {
						new validators[validator]($(elements[i]), options);
					}
				}
				return el;
			},
			/**
			 * Add the configured error listeners to this element
			 */
			_addErrorListeners: function () {
				var o	= this._getErrorMessageOptions();
				
				if (this.element.is(':input')) {
					this._applyErrorListenersToSelf(o);
				} else {
					this._applyErrorListenersToChildren(o);
				}
			},
			/**
			 * Add the configured error listeners to the element referenced by
			 * "this.element"
			 * @param {Object.<string,*>} options
			 */
			_applyErrorListenersToSelf: function (options) {
				var el	= this.element;
				
				if (this.elementId) {
					$('label[for="' + this.elementId + '"]').form_element_listener_error_styling({
						"fieldList": [ el ]
					});
				}
				el.form_element_listener_error_styling({
					"errorClass": 'ui-state-error'
				});
				
				if (this.options.errorListVisible) {
					options.listenTo	= el;
					el.form_element_listener_error_message(options);
				}
			},
			/**
			 * Add the configured error listeners to this element's children.
			 * @param {Object.<string,*>} options
			 */
			_applyErrorListenersToChildren: function (options) {
				var el	= this.element;
				o		= this.options;
				
				options.fieldList	= [ el ];
				
				el.find(':input').form_element_listener_error_styling({
					"fieldList": [ el ],
					"errorClass": 'ui-state-error'
				});
				el.find('label').form_element_listener_error_styling({
					"fieldList": [ el ]
				});
				
				if (this.options.errorListVisible) {
					options.listenTo	= el;
					el.form_element_listener_error_message(options);
				}
			},
			/**
			 * Get the error message display options.
			 * @return {Object.<string,*>}
			 */
			_getErrorMessageOptions: function () {
				var o	= this.options,
				mo		= {
					level: o.errorListLevel,
					position: o.errorListPosition,
					target: o.errorListTarget
				};
				
				if (o.errorListFields.length) {
					mo.fieldList	= o.errorListFields;
				}
				
				return mo;
			},
			/**
			 * Handle the form submit event for this element
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			_handleFormSubmit: function (event) {
				this.element.trigger(EventHelper.validation.start);
				return false;
			},
			/**
			 * Handle an element error from the form.
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			_handleFormElementError: function (event) {
				var error	= event.error,
				element_name	= error.hasOwnProperty('element_name') ? error.element_name : null;
				
				if (element_name && $.inArray(element_name, this.options.element_names)) {
					this.element.trigger(EventHandler.error, {"error": error});
				}
				return false;
			},
			/**
			 * Initialize the jQueryUI styling for this element.
			 */
			_initUIStyle: function () {
				var style_target,
				o	= this.options;
				
				if (this.element.is(':input')) {
					style_target	= this.element;
				} else {
					style_target	= this.element.find('input,textarea');
				}
				
				style_target.bind('mouseenter mouseleave', function () {
					$(this).toggleClass(o.hoverClass);
				});
				style_target.bind('click focus', function () {
					$(this).addClass(o.focusClass);
				});
				style_target.bind('blur', function () {
					$(this).removeClass(o.focusClass);
				});
			}
		});
	});
}(jQuery, cjaf));