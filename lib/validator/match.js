/**
 * A validator to ensure that a given string matches another given value or
 * the value of a given HTML form element.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/match', [
		'lib/validator/abstract',
		'lib/message/constants'
	],
	function (ValidatorAbstract, MessageConstants) {
		cjaf.Validator.Match	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var confirmValue	= (typeof this.options.itemToMatch.val === 'function') ? this.options.itemsToMatch.val() : this.options.itemToMatch;
				
				return (value === confirmValue);
			},
			getErrorType: function () {
				return MessageConstants.MATCH;
			}
		});
		return cjaf.Validator.Match;
	});
}(jQuery, cjaf));