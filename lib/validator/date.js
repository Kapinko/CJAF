(function($, cjaf){
	cjaf.define('lib/validator/date', [
		'lib/validator/abstract'
	],
	function(ValidatorAbstract){
		ValidatorAbstract.extend("cjaf.Validator.Date",
		/* @Static */
		{},
		/* @Prototype */
		{
			init: function(element, options){
				this._super(element, $.extend({}, this.defaults, options));
			},
			_validate: function()
			{
				var value = this.getValue();
				if (this.isEmpty())
				{
					return this.options.allowEmpty;
				}
				var date = new Date(value);

				if (date.toString().toLowerCase() == 'invalid date')
				{
					return false;
				}
				
				var dates=this.getValue().split('/');
				var month = dates[0];
				var day = dates[1];
				var year = dates[2];

				if(dates.length!=3 || month>12 || month <1 || day >31 || day <1 || year > ((new Date()).getFullYear()))
				{
					return false;
				}

				if(day>27)
				{
					var dayCheckDate = new Date();
					dayCheckDate.setFullYear(year, month-1, day);
					if(dayCheckDate.getDate()!=day)
						{
							return false;
						}
				}
				return true;
			}
		});
		return cjaf.Validator.Date;
	});
})(jQuery,cjaf);
