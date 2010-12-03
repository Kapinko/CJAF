(function($,cjaf){
	cjaf.define('lib/validator/integer', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Integer",
		/* @Static */
		{},
		/* @Prototype */
		{
			defaults: {},
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
				} else {
					is_valid	= (parseInt(value, 10) == value) ? true : false;
				}
				return is_valid;
			},
			getErrorType: function(){
				return MessageConstants.INVALID;
			}
		});
		return cjaf.Validator.Integer;
	});
})(jQuery, cjaf);