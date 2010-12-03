(function($, cjaf){
	cjaf.define('lib/validator/not_empty', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend('cjaf.Validator.NotEmpty',
		/* @Static */
		{},
		/* @Prototype */
		{
			_validate: function(){
				return !this.isEmpty();
			},
			/**
			 * @return {string}
			 */
			getErrorType: function(){
				return MessageConstants.EMPTY;
			}
		});
		return cjaf.Validator.NotEmpty;
	});
})(jQuery, cjaf);