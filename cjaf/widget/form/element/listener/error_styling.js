(function($, cjaf){
	cjaf.define('cjaf/widget/form/element/listener/error_styling', [
		'cjaf/widget/form/element/listener'
	],
	function(){
		$.widget('cjaf.form_element_listener_error_styling', $.cjaf.form_element_listener, {
			options: {
				/**
				 * @type {string}
				 */
				errorClass: 'ui-state-error-text'
			},
			/**
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			handleErrorEvent: function(event){
				this.markAsError();
			},
			/**
			 * Function to react to the form.clear event.
			 *
			 * @param {Object} event - event string
			 */
			handleClearEvent: function(event){
				this.clearErrorMark();
			},
			/**
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			handleValidationStartEvent: function(event){
				this.clearErrorMark();
			},
			/**
			 * Function to react to the form.error.clear event.
			 *
			 * @param {jQuery.Event} event
			 * @param {jQuery.Event} errorCode
			 */
			handleValidationFailedEvent: function(event, errorCode){
				this.markAsError();
			},
			/**
			 * @return {jQuery}
			 */
			markAsError: function(){
				this.element.addClass(this.getErrorClass());
				return this.element;
			},
			/**
			 * @return {jQuery}
			 */
			clearErrorMark: function(){
				this.element.removeClass(this.getErrorClass());
				return this.element;
			},
			/**
			 * @return {String}
			 */
			getErrorClass: function(){
				return this.options.errorClass;
			}
		});
	});
})(jQuery, cjaf);