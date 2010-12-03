/**
 * A validator to ensure that a given value does not exceed a set maximum value.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/maximum_length', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.MaximumLength	= cjaf.Class.extend(ValidatorAbstract, {
			defaults: {
				maximumLength: Number.MAX_VALUE
			},
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else if (value.hasOwnProperty('length') && value.length > this.options.maximumLength) {
					is_valid	= false;
				}
				return is_valid;
			},
			getErrorType: function () {
				return MessageConstants.MAX_LENGTH;
			}
		});
		return cjaf.Validator.MaximumLength;
	});
}(jQuery, cjaf));