(function($, cjaf){
	cjaf.define('cjaf/widget/form/element/listener', [
		'cjaf/widget/form/helper/event'
	],
	/**
	 * @param {FormEvents} FormEvents
	 */
	function(FormEvents){
		$.widget('cjaf.form_element_listener', {
			options: {
				fieldList: []
			},
			/**
			 * Initialize this form element listener.
			 */
			_create: function(){
				var el	= this.element,
					o	= this.options;

				if(!$.isArray(o.fieldList)){
					o.fieldList	= new Array();
				}
				if(el.is(':input')){
					o.fieldList.push(el);
				}
				if(o.fieldList.length < 1){
					throw "You must provide a list of fields for this listener to listen to or attach this widget to a form input";
				}
				for(var x=0; x<o.fieldList.length; x++)
				{
					var field	= o.fieldList[x];
					this._bindValidationStartEvent(field);
					this._bindValidationFailedEvent(field);
					this._bindErrorEvent(field);
					this._bindClearEvent(field);
				}
			},
			/**
			 * Bind the validation failed event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindValidationFailedEvent: function(element){
				var self	= this;
				element.bind(FormEvents.validation.failed, function(){
					self.handleValidationFailedEvent.apply(self, arguments);
				});
			},
			/**
			 * Bind the clear event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindValidationStartEvent: function(element){
				var self	= this;
				element.bind(FormEvents.validation.start, function(){
					self.handleValidationStartEvent.apply(self, arguments);
				});
			},
			/**
			 * Bind the error event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindErrorEvent: function(element){
				var self	= this;
				element.bind(FormEvents.error, function(){
					self.handleErrorEvent.apply(self, arguments);
				});
			},
			/**
			 * Bind the clear event handler for the given jQuery element.
			 *
			 * @param {jQuery} element
			 */
			_bindClearEvent: function(element){
				var self	= this;
				element.bind(FormEvents.element.clear, function(){
					self.handleClearEvent.apply(self, arguments);
				});
			},
			/**
			 * Function to react to the form.error event.
			 *
			 * @param {jQuery.Event} event
			 * @param {string} error
			 */
			handleErrorEvent: function(event, error){},
			/**
			 * Function to react to the form.error.clear event.
			 *
			 * @param {jQuery.Event} event
			 */
			handleValidationStartEvent: function(event){},
			/**
			 * Function to react to the form.error.clear event.
			 *
			 * @param {jQuery.Event} event
			 * @param {jQuery.Event} errorCode
			 */
			handleValidationFailedEvent: function(event, errorCode){},
			/**
			 * Function to react to the form.clear event.
			 *
			 * @param {Object} event - event string
			 */
			handleClearEvent: function(event){}
		});
	});
})(jQuery, cjaf);