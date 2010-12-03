/**
 * A validator to ensure that a given value is a possible ABA routing number.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/routing_number', [
		'lib/validator/abstract'
	],
	function (ValidatorAbstract) {
		cjaf.Validator.RoutingNumber	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;

				} else if (this.checksum(value) === 0) {
					is_valid	= false;

				} else if (!this.checkdigit(value)) {
					is_valid	= false;

				} else if (!this.checkprefix(value)) {
					is_valid	= false;
				}
				return is_valid;
			},
			checksum: function (value) {
				var checksum	= this.getChecksum(value) % 10;
				return checksum === 0 ? true : false;
			},
			checkdigit: function (value) {
				var digits	= this.getDigits(value), checksum, checkdigit;
				checksum	= (
					3 * (digits[0] + digits[3] + digits[6]) +
					7 * (digits[1] + digits[4] + digits[7]) +
					1 * (digits[2] + digits[5])
				);

				checkdigit	= (10 - checksum % 10) % 10;

				return digits[8] === checkdigit ? true : false;
			},
			checkprefix: function (value) {
				var digits	= value.substr(0, 2) * 1;
				return ((digits >= 0 && digits <= 12) || (digits >= 21 && digits <= 32) || (digits >= 61 && digits <= 72) || digits === 80) ? true : false;
			},
			/**
			 * @param {number}
			 * @return {Array}
			 */
			getDigits: function (value) {
				var digits = value.split(""), i;
				for (i = 0; i < digits.length; i += 1) {
					digits[i]	= digits[i] * 1;
				}
				return digits;
			},
			/**
			 * @param {number}
			 * @return {Array}
			 */
			getChecksum: function (value) {
				var digits	= this.getDigits(value), checksum;

				checksum	= (
					3 * (digits[0] + digits[3] + digits[6]) +
					7 * (digits[1] + digits[4] + digits[7]) +
					1 * (digits[2] + digits[5] + digits[8])
				);
				return checksum;
			}
		});
		return cjaf.Validator.RoutingNumber;
	});
}(jQuery, cjaf));