/**
 * This is a validator to ensure that a given string represents an integer.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/integer', [
		'lib/validator/abstract'
	],
	function (ValidatorAbstract) {
		cjaf.Validator.Integer	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var is_valid	= true;

				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else {
					is_valid	= (parseInt(value, 10) === value) ? true :false;
				}
				return is_valid;
			}
		});
		return cjaf.Validator.Integer;
	});
}(jQuery, cjaf));