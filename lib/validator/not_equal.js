/**
 * A validator to ensure that a given value is not equal to a set value or the
 * value of a HTML form element.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/not_equal', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.NotEqual	= cjaf.Class.extend(ValidatorAbstract, {
			defaults: {
				itemToNotEqual: {}
			},
			"_validate": function (value) {
				var other	= this.options.itemToNotEqual, confirm;
				confirm	= (typeof other.val === 'function') ? other.val() : other;
				
				return (value !== confirm);
			},
			getErrorType: function () {
				return MessageConstants.NOT_EQUAL;
			}
		});
		return cjaf.Validator.NotEqual;
	});
}(jQuery, cjaf));