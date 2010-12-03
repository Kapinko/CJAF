(function($,cjaf){
	cjaf.define('lib/validator/number', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		cjaf.Validator.Number	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else {
					is_valid	= (parseInt(value, 10) === value) || !isNan(value);
				}
				return is_valid;
			},
			getErrorType: function(){
				return MessageConstants.INVALID;
			}
		});
		return cjaf.Validator.Number;
	});
}(jQuery, cjaf));