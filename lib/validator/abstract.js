/**
 * This is an abstract validator class that defines the validator interface.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen: false*/

(function ($, cjaf) {
	cjaf.define('lib/validator/abstract', [
		'lib/validator'
	],
	/**
	 * @param {cjaf.Validator} Validator
	 * @return {cjaf.Validator.Abstract}
	 */
	function (Validator) {
		Validator.Abstract	= cjaf.Class.extend(Validator, {
			/**
			 * @type {Object}
			 */
			defaults: {
				/**
				 * Is the element to be validated allowed to be empty?
				 *
				 * @type {boolean}
				 */
				allowEmpty: false,
				/**
				 * A list of the dependency functions.
				 *
				 * @type {Array.<function>}
				 */
				dependencies: [],
				/**
				 * This is the validation failure event type.
				 * @type {string}
				 */
				"event_type": "form_validation_failed"
			},
			/**
			 * Initialize the validator.
			 *
			 * @param {jQuery} element
			 * @param {Object} options
			 */
			"init": function (element, options) {
				/**
				 * @type {Object}
				 */
				this.options	= $.extend({}, this.defaults, options);
				
				Validator.prototype.init.apply(this, arguments);
			},
			/**
			 * Does the element to be validated have an empty value?
			 *
			 * @return {boolean}
			 */
			"isEmpty": function () {
				var value		= this.getValue(),
					is_empty	= false;

				if (this._isCheckboxOrRadioButton()) {
					is_empty	= !this.isChecked();
				} else if ((value === '') || (value === null)) {
					is_empty	= true;
				}
				return is_empty;
			},
			/**
			 * Has the element to be validated been checked?
			 *
			 * @return {boolean}
			 */
			"isChecked": function () {
				return this.element.is(':checked');
			},
			/**
			 * External validation function, if all dependencies are met then run
			 * the internal validation, if not then just ignore value and return
			 * true.
			 *
			 * @return {boolean}
			 */
			"validate": function () {
				var is_valid	= true,
				value;

				if (this._areDependenciesMet()) {
					value		= this.getValue();
					is_valid	= this._validate(value);
				}

				if (!is_valid) {
					this.element.trigger(this.options.event_type, this.getErrorType());
				}
				return is_valid;
			},
			/**
			 * Internal validation function that will ensure that the value
			 * returned by the get value function falls within acceptable limits.
			 * 
			 * @param {*} value
			 * @return {boolean}
			 */
			_validate: function (value) {
				return true;
			},
			/**
			 * Have we met all of our dependencies to go ahead and perform validtion?
			 *
			 * @return {boolean}
			 */
			_areDependenciesMet: function () {
				var been_met		= true,
					dependencies	= this.options.dependencies,
					index, dependency;

				if ($.isArray(dependencies)) {
					for (index = 0; index < dependencies.length; index += 1) {
						dependency	= dependencies[index];
						if (typeof(dependency === 'function') && !dependency()) {
							been_met	= false;
							break;
						}
					}
				}
				return been_met;
			},
			/**
			 * Is the element to be validated a checkbox or radio button?
			 *
			 * @return {boolean}
			 */
			_isCheckboxOrRadioButton: function () {
				var is_checkable	= false,
					el				= this.element,
					type;
				if (el.tag_name	=== 'input') {
					type	= el.attr('type');
					
					if (typeof type === 'string') {
						type	= type.toLowerCase();
					}
					
					is_checkable	= (type === 'radio') || (type === 'checkbox');
				}
				return is_checkable;
			}
		});
		
		return cjaf.Validator.Abstract;
	});
}(jQuery, cjaf));