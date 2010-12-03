(function($,cjaf){
	cjaf.define('lib/validator/name', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Name",
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
				return value.match(/^[a-zA-Z\-'\s]+$/);
			}
		});
		return cjaf.Validator.Name;
	});
})(jQuery, cjaf);