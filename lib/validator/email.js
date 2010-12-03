(function($,cjaf){
	cjaf.define('lib/validator/email', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Email",
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
				var value = this.getValue();
				if (this.isEmpty())
				{
					return this.options.allowEmpty;
				}
				var valid = value.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1;
				return valid;
			}
		});
		return cjaf.Validator.Email;
	});
})(jQuery, cjaf);