(function($,cjaf){
	cjaf.define('lib/validator/match', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
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