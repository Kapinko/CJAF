(function($,cjaf){
	cjaf.define('lib/validator/maximum_value', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.MaximumValue",
		/* @Static */
		{},
		/* @Prototype */
		{
			defaults: {
				maximumValue: Number.MAX_VALUE
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
				} else if( value > this.options.maximumValue){
					is_valid	= false;
				}
				return is_valid;
			},
			getErrorType: function(){
				return MessageConstants.MAX_VALUE;
			}
		});
		return cjaf.Validator.MaximumValue;
	});
})(jQuery, cjaf);