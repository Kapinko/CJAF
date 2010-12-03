/**
 * A validator to ensure that the given string passes the luhn algorithm and
 * therefore is a possible credit card number.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/luhn', [
		'lib/validator/abstract'
	],
	function (ValidatorAbstract) {
		cjaf.Validator.Luhn	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else {
					is_valid	= this.luhnCheck(value);
				}
				return is_valid;
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
			luhnCheck: function (number_to_check) {
				var length, parity, total, i, digit;
				
				//Strip any non-digits
				number_to_check	= number_to_check.replace(/\D/g, '');

				//Set the string length and parity
				length	= number_to_check.length;
				parity	= length % 2;
				total	= 0;

				//Loop through each digit and do the maths.
				for (i = (length - 1); i >= 0 ; i = i - 1) {
					digit	= number_to_check.charAt(i);

					//Multiply alternate digits by two.
					if (i % 2 === parity) {
						digit	= digit * 2;

						//If the sum is two digits, add them together (in effect)
						if (digit > 9) {
							digit	= digit - 9;
						}
					}
					//Total up the digits
					total += parseInt(digit, 10);
				}

				//If the total mod 10 equals 0, the number is valid.
				return (total % 10 === 0) ? true : false;
			}
		});
		return cjaf.Validator.Luhn;
	});
}(jQuery, cjaf));