/**
 * A validator to ensure that a given string has a length greater than or equal
 * to a set minimum length.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/minimum_length', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.MinimumLength	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else if (value.hasOwnProperty('length') && value.length < this.options.minimumLength) {
					is_valid	= false;
				}
				return is_valid;
			},
			getErrorType: function () {
				return MessageConstants.MIN_LENGTH;
			}
		});
		return cjaf.Validator.MinimumLength;
	});
}(jQuery, cjaf));