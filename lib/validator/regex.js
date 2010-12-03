/**
 * A validator to ensure that a given value "passes"/matches a set regular
 * expression
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('lib/validator/regex', [
		'lib/validator/abstract'
	],
	function (ValidatorAbstract) {
		cjaf.Validator.Regex	= cjaf.Class.extend(ValidatorAbstract, {
			defaults: {
				regex: null
			},
			"_validate": function (value) {
				var is_valid	= true;
				
				if (this.isEmpty()) {
					is_valid	= this.options.allowEmpty;
				} else {
					is_valid	= value.search(this.options.regex) !== -1 ? true : false;
				}
				return is_valid;
			}
		});
		return cjaf.Validator.Regex;
	});
}(jQuery, cjaf));