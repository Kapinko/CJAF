(function($){
	var ValidationResults	= function(){
		this._empty	= true;
		this._errors	= {};
	}
	ValidationResults.prototype	= {
		/**
		 * @return {boolean}
		 */
		isValid: function(){
			return this._empty ? true : false;
		},
		/**
		 * @param {string} fieldId
		 * @param {string} error
		 * @return {ValidationResults}
		 */
		addError: function(fieldId, error){
			if(this._errors[fieldId] == null){
				this._errors[fieldId] = new Array();
			}
			this._errors[fieldId].push(error);
			if(this._empty){
				this._empty	= false;
			}
			return this;
		},
		/**
		 * @return {Object}
		 */
		getErrors: function(){
			return this._errors;
		}
	};
	window.ValidationResults	= ValidationResults;

	/**
	 * Add a validate function to the jQuery element functions.
	 *
	 * @param {Object} settings
	 * @return {ValidationResults}
	 */
	$.fn.validate	= function(settings){
		var results	= new ValidationResults();

		var config	= {
			runAllValidators: false
		}

		if(settings) $.extend(config, settings);

		this.each(function(){
			var validators	= $.data(this, 'cjaf.validators');
			for(var className in validators){
				var validator	= validators[className],
					el			= $(this);

				if(!validator.validate()){
					results.addError(el.attr('id'), validator.getErrorType());

					if(!config.runAllValidators){
						return;
					}
				}
			}
		});

		return results;
	};
	/**
	 * Add a group of validators to the attached element.
	 * @param {Array.<Object>} validators
	 * @return {jQuery}
	 */
	$.fn.addValidators	= function (validators) {
		if ($.isArray(validators)) {
			var elements	= $(this);

			$.each(validators, function (index, options) {
				elements.addValidator(options.type, options.options);
			});
		}

		return $(this);
	};
	/**
	 * Add a validator to the attached element.
	 * @param {string} type
	 * @param {Object} options
	 * @return {jQuery}
	 */
	$.fn.addValidator	= function (type, options) {
		var self	= $(this),
		elements	= self.find(":input"),
		validators	= cjaf.Validator,
		i, obj;

		if (self.is(":input")) {
			elements	= elements.add(self);
		}
		if (typeof options === 'undefined') {
			options	= {};
		}

		elements.each(function (index, element) {
			var validator	= validators[type];

			if (typeof validator === 'function') {
				obj	= new validator($(element), options);
			}
		});

		return self;
	};
})(jQuery);