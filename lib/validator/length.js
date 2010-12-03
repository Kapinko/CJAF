(function($,cjaf){
	cjaf.define('lib/validator/length', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		cjaf.Validator.Length	= cjaf.Class.extend(ValidatorAbstract, {
			defaults: {
				minimumLength: Number.MIN_VALUE,
				maximumLength: Number.MAX_VALUE
			},
			errorType:  null,
			
			"_validate": function (value) {
				var is_valid	= true,
				o			= this.options,
				length;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else {
					length	= new String(value).length;
					
					if (length < o.minimumLength) {
						is_valid		= false;
						this.errorType	= MessageConstants.MIN_LENGTH;
					
					} else if (length > o.maximumLength) {
						is_valid		= false;
						this.errorType	= MessageConstants.MAX_LENGTH;
					}
				}
				return is_valid;
			},
			getErrorType: function () {
				if (!this.errorType) {
					this.errorType	= MessageConstants.LENGTH;
				}
				return this.errorType;
			}
		});
		return cjaf.Validator.Length;
	});
}(jQuery, cjaf));