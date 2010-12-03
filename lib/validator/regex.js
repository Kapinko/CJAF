(function($,cjaf){
	cjaf.define('lib/validator/regex', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Regex",
		/* @Static */
		{},
		/* @Prototype */
		{
			defaults: {
				regex: null
			},
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
				var valid	= true;

				if(this.options.regex){
					valid	= value.search(this.options.regex) != -1 ? true : false;
				}
				return valid;
			}
		});
		return cjaf.Validator.Regex;
	});
})(jQuery, cjaf);