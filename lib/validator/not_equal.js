(function($,cjaf){
	cjaf.define('lib/validator/not_equal', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.NotEqual",
		/* @Static */
		{
		},
		/* @Prototype */
		{
			defaults: {
				itemToNotEqual: {}
			},
			init: function (element, options) {
				this._super(element, jQuery.extend({}, this.defaults, options));
			},
			_validate: function () {
				var value = this.getValue();
				var confirmValue = (typeof this.options.itemToNotEqual.val === 'function') ? this.options.itemToNotEqual.val() : this.options.itemToNotEqual;
				return (value != confirmValue);
			},
			getErrorType: function(){
				return MessageConstants.NOT_EQUAL;
			}
		});
		return cjaf.Validator.NotEqual;
	});
})(jQuery, cjaf);