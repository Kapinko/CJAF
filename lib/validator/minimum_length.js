(function($,cjaf){
	cjaf.define('lib/validator/minimum_length', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.MinimumLength",
		/* @Static */
		{},
		/* @Prototype */
		{
			defaults: {
				minimumLength: Number.MIN_VALUE
			},
			/**
			 * Initialize this Validator.
			 *
			 * @param {jQuery} element
			 * @param {Object} options
			 */
			init: function(element, options){
				this._super(element, $.extend({}, this.defaults, options));
			},
			_validate: function(){
				var value		= this.getValue(),
					is_valid	= true;
				if(this.isEmpty()){
					is_valid	= this.options.allowEmpty ? true : false;
				} else if( value['length'] < this.options.minimumLength){
					is_valid	= false;
				}
				return is_valid;
			},
			getErrorType: function(){
				return MessageConstants.MIN_LENGTH;
			}
		});
		return cjaf.Validator.MinimumLength;
	});
})(jQuery, cjaf);