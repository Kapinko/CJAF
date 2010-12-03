/**
 * A validator to ensure that a given value is a non-empty value.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/not_empty', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.NotEmpty	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function () {
				return !this.isEmpty();
			},
			getErrorType: function () {
				return MessageConstants.EMPTY;
			}
		});
		return cjaf.Validator.NotEmpty;
	});
}(jQuery, cjaf));