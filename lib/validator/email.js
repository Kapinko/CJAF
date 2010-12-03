/**
 * A validator class to ensure that a given string represents a syntactically 
 * valid email address.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('lib/validator/email', [
		'lib/validator/abstract'
	],
	function (ValidatorAbstract) {
		cjaf.Validator.Email	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				var valid;
				
				if (this.isEmpty()) {
					return this.options.allowEmpty;
				}
				
				valid	= value.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1;
				return valid;
			}
		});
		return cjaf.Validator.Email;
	});
}(jQuery, cjaf));