(function($,cjaf){
	cjaf.define('lib/validator/not_equal', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		cjaf.Validator.NotEqual	= cjaf.Class.extend(ValidatorAbstract, {
			defaults: {
				itemToNotEqual: {}
			},
			"_validate": function (value) {
				var other	= this.options.itemToNotEqual, confirm;
				confirm	= (typeof other.val === 'function') ? other.val() : other;
				
				return (value !== confirm);
			},
			getErrorType: function(){
				return MessageConstants.NOT_EQUAL;
			}
		});
		return cjaf.Validator.NotEqual;
	});
}(jQuery, cjaf));