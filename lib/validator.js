/**
 * This is the base object for a validator.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('lib/validator', [
		'lib/message/constants',
		'jQuery/jquery.validate'
	],
	/**
	 * @param {MessageConstants} MessageConstants
	 * @return {cjaf.Validator}
	 */
	function (MessageConstants) {
		/**
		 * This is the name space of our data cache. (stored using $.data)
		 * @type {string}
		 */
		var DATA_CACHE_ID	= 'cjaf.validators'
		
		/**
		 * This is a static counter used in the naming of validator instances
		 * @type {number}
		 */
		cjaf.validator_counter	= 0;
		
		/**
		 * This is a generic validator name used if the user does not provide one
		 * @type {string}
		 */
		var generic_name	= 'CJAF_VALIDATOR';
		
		/**
		 * An object used to perform validation.
		 * @param {jQuery} element
		 * @param {string} name
		 * @constructor
		 */
		cjaf.Validator	= function (element, name) {
			element	= (element.hasOwnProperty('jquery')) ? element[0] : element;
			
			/**
			 * @type {jQuery}
			 */
			this.element	= $(element);
			
			/**
			 * This is the name of this validator.
			 * @type {string}
			 */
			this.name		= (name) ? name : generic_name;
			
			/**
			 * this is the name of this specific instance
			 * @type {string}
			 */
			this.instance_name	= null;
			
			($.data(element, DATA_CACHE_ID) || $.data(element, DATA_CACHE_ID, {}))[this._getInstanceName()] = this;
		};
		cjaf.Validator.prototype	= {
			/**
			 * Remove this validator
			 */
			"destroy": function () {
				var validators	= this.element.data(DATA_CACHE_ID),
				my_name			= this._getInstanceName();
				
				if (validators && validators[my_name]) {
					delete validators[my_name]
				}
				this.element	= null;
			},
			/**
			 * Run validation.
			 * @return {boolean}
			 */
			"validate": function () {
				return true;
			},
			/**
			 * Get the value to validate
			 * @return {*}
			 */
			"getValue": function () {
				var value	= (typeof this.element.val === 'function') ? this.element.val() : '';
				value		= $.trim(value);
				
				return value;
			},
			/**
			 * Get the type of validation error.
			 * @return {string}
			 */
			"getErrorType": function () {
				return MessageConstants.INVALID;
			},
			/**
			 * Get the name of this validator instance.
			 * @return {string}
			 */
			_getInstanceName: function () {
				if (this.instance_name === null) {
					this.instance_name	= this.name + '.' + (cjaf.validator_counter += 1);
				}
				return this.instance_name;
			}
		};
		
		return cjaf.Validator;
	});
}(jQuery, cjaf));