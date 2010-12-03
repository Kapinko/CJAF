/**
 * A validator to ensure that a given value is a string that represents a valid
 * date.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('lib/validator/date', [
		'lib/validator/abstract'
	],
	function (ValidatorAbstract) {
		cjaf.Validator.Date	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var day, month, year, date, date_parts, dayCheckDate;
				
				if (this.isEmpty()) {
					return this.options.allowEmpty;
				}
				date	= new Date(value);
				
				if (date.toString().toLowerCase() === 'invalid date') {
					return false;
				}
				
				date_parts	= value.split('/');
				if (date_parts.length === 3) {
					month	= date_parts[0];
					
					if (month < 1 || month > 12) {
						return false;
					}
					
					day		= date_parts[1];
					
					if (day < 1 || day > 31) {
						return false;
					}
					
					year	= date_parts[2];
					
					if (year > ((new Date()).getFullYear())) {
						return false;
					}
					
				} else {
					return false;
				}
				
				if (date_parts[1] > 27) {
					dayCheckDate	= new Date();
					dayCheckDate.setFullYear(year, month - 1, day);
					
					if (dayCheckDate.getDate() !== day) {
						return false;
					}
				}
				
				return true;
			}
		});
		return cjaf.Validator.Date;
	});
}(jQuery, cjaf));
