(function($, cjaf){
	cjaf.define('lib/validator/not_empty', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
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