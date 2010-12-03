/**
 * A validator to ensure that a given value does not exeed the set maximum 
 * value.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/maximum_value', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.MaximumValue	= cjaf.Class.extend(ValidatorAbstract, {
			defaults: {
				maximumValue: Number.MAX_VALUE
			},
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else if (value > this.options.maximumValue) {
					is_valid	= false;
				}
				return is_valid;
			},
			getErrorType: function () {
				return MessageConstants.MAX_VALUE;
			}
		});
		return cjaf.Validator.MaximumValue;
	});
}(jQuery, cjaf));