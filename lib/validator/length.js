(function($,cjaf){
	cjaf.define('lib/validator/length', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Length",
		/* @Static */
		{},
		/* @Prototype */
		{
			defaults: {
				minimumLength: Number.MIN_VALUE,
				maximumLength: Number.MAX_VALUE
			},
			errorType: null,
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
					is_valid	= true,
					o			= this.options;

				if(this.isEmpty()){
					is_valid	= this.options.allowEmpty ? true : false;

				} else {
					var length		= new String(value).length;
					if(length < o.minimumLength){
						is_valid		= false;
						this.errorType	= MessageConstants.MIN_LENGTH;
					}
					if(length > o.maximumLength){
						is_valid		= false;
						this.errorType	= MessageConstants.MAX_LENGTH;
					}
				}
				return is_valid;
			},
			getErrorType: function(){
				if(!this.errorType){
					this.errorType	= MessageConstants.LENGTH;
				}
				return this.errorType;
			}
		});
		return cjaf.Validator.Length;
	});
})(jQuery, cjaf);