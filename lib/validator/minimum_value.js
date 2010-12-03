/**
 * A validator to ensure that a given value is greater than or equal to a 
 * set minimum value.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/minimum_value', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.MinimumValue	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else if (value < this.options.minimumValue) {
					is_valid	= false;
				}
				return is_valid;
			},
			getErrorType: function () {
				return MessageConstants.MIN_VALUE;
			}
		});
		return cjaf.Validator.MinimumValue;
	});
}(jQuery, cjaf));