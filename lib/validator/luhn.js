(function($,cjaf){
	cjaf.define('lib/validator/luhn', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Luhn",
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
					is_valid	= this.luhnCheck(value);
				}
				return is_valid;
			},
			getErrorType: function(){
				return MessageConstants.INVALID;
			},
			/**
			 * Luhn algorithm number checker - (c) 2005-2009 - planzero.org
			 * This code has been released into the public domain, however please
			 * give credit to the original author where possible.
			 * @see http://blog.planzero.org/2009/08/javascript-luhn-modulus-implementation
			 * @see http://en.wikipedia.org/wiki/Luhn_algorithm
			 *
			 * @param {string} number_to_check
			 * @return {boolean}
			 */
			luhnCheck: function(number_to_check){
				//Strip any non-digits
				number_to_check	= number_to_check.replace(/\D/g, '');

				//Set the string length and parity
				var length	= number_to_check.length;
				var parity	= length % 2;
				var total	= 0;

				//Loop through each digit and do the maths.
				for(var i= (length -1); i >= 0 ; i--){
					var digit	= number_to_check.charAt(i);

					//Multiply alternate digits by two.
					if(i % 2 == parity){
						digit	= digit * 2;

						//If the sum is two digits, add them together (in effect)
						if(digit > 9){
							digit	= digit - 9
						}
					}
					//Total up the digits
					total += parseInt(digit);
				}

				//If the total mod 10 equals 0, the number is valid.
				return (total % 10 == 0) ? true : false;
			}
		});
		return cjaf.Validator.Luhn;
	});
})(jQuery, cjaf);