(function($,cjaf){
	cjaf.define('lib/validator/match', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Match",
		/* @Static */
		{
		},
		/* @Prototype */
		{
			defaults: {
				itemToMatch: {}
			},
			init: function (element, options) {
				this._super(element, jQuery.extend({}, this.defaults, options));
			},
			_validate: function () {
				var value = this.getValue();
				var confirmValue = (typeof this.options.itemToMatch.val === 'function') ? this.options.itemToMatch.val() : this.options.itemToMatch;
				return (value == confirmValue);
			},
			getErrorType: function(){
				return MessageConstants.MATCH;
			}
		});
		return cjaf.Validator.Match;
	});
})(jQuery, cjaf);