(function($, cjaf){
	cjaf.define('lib/validator/abstract', [
		'lib/validator',
		'lib/event/form/factory'
	],
	/**
	 * @param {$.Validator}
	 * @param {FormEvents} FormEvents
	 */
	function(Validator, FormEvents){
		Validator.extend('cjaf.Validator.Abstract',
			/* @Static */
			{},
			/* @Prototype */
			{
				/**
				 * @type {Object}
				 */
				defaults: {
					/**
					 * Is the element to be validated allowed to be empty?
					 *
					 * @type {boolean}
					 */
					allowEmpty: false,
					/**
					 * A list of the dependency functions.
					 *
					 * @type {Array.<function>}
					 */
					dependencies: []
				},
				/**
				 * Initialize the validator.
				 *
				 * @param {jQuery} element
				 * @param {Object} options
				 */
				init: function(element, options){
					/**
					 * @type {Object}
					 */
					this.options	= $.extend({}, this.defaults, options);
					this._super(element);
				},
				/**
				 * Does the element to be validated have an empty value?
				 *
				 * @return {boolean}
				 */
				isEmpty: function(){
					var value		= this.getValue(),
						is_empty	= false;

					if(this._isCheckboxOrRadioButton()){
						is_empty	= !this.isChecked();
					} else if((value == '') || (value == null)){
						is_empty	= true;
					}
					return is_empty;
				},
				/**
				 * Has the element to be validated been checked?
				 *
				 * @return {boolean}
				 */
				isChecked: function(){
					return this.element.is(':checked');
				},
				/**
				 * External validation function, if all dependencies are met then run
				 * the internal validation, if not then just ignore value and return
				 * true.
				 *
				 * @return {boolean}
				 */
				validate: function(){
					var is_valid	= true;

					if(this._areDependenciesMet()){
						is_valid	= this._validate();
					}

					if(!is_valid){
						this.element.trigger(FormEvents.validation.failed, this.getErrorType());
					}
					return is_valid;
				},
				/**
				 * Internal validation function that will ensure that the value
				 * returned by the get value function falls within acceptable limits.
				 *
				 * @return {boolean}
				 */
				_validate: function(){
					return true;
				},
				/**
				 * Have we met all of our dependencies to go ahead and perform validtion?
				 *
				 * @return {boolean}
				 */
				_areDependenciesMet: function(){
					var been_met		= true,
						dependencies	= this.options.dependencies;

					if($.isArray(dependencies)){
						for(var i=0; i < dependencies.length; i++){
							var dependency	= dependencies[i];
							if(typeof(dependency === 'function') && !dependency()){
								been_met	= false;
								break;
							}
						}
					}
					return been_met;
				},
				/**
				 * Is the element to be validated a checkbox or radio button?
				 *
				 * @return {boolean}
				 */
				_isCheckboxOrRadioButton: function(){
					var is_checkable	= false,
						tag_name		= (new String(this.element.tagName)).toLowerCase();
					if(tag_name	== 'input'){
						var type	= (new String(this.element.attr('type'))).toLowerCase();
						is_checkable	= (type == 'radio') || (type == 'checkbox');
					}
					return is_checkable;
				}
		});
		return cjaf.Validator.Abstract;
	});
})(jQuery, cjaf);