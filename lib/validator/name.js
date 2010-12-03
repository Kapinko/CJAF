(function($,cjaf){
	cjaf.define('lib/validator/name', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		cjaf.Validator.Name	= cjaf.Class.extend(ValidatorAbstract, {
			"_validate": function (value) {
				if (this.isEmpty()) {
					return this.options.allowEmpty;
				}
				return value.match(/^[a-zA-Z\-'\s]+$/);
			}
		});
		return cjaf.Validator.Name;
	});
}(jQuery, cjaf));