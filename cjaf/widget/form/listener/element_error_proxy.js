/**
 * This is a proxy listener that will display the error messages for any
 * given form elements.
 */
/** JSlint Declarations */
/*global jQuery: false, cjaf: false */
/*jslint nomen: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/listener/element_error_proxy', [
		'cjaf/widget/form/helper/event',
		'cjaf/widget/form/listener/error_message'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 */
	function (EventHelper) {
		$.widget('cjaf.form_listener_element_error_proxy', $.cjaf.form_listener_error_message, {
			/**
			 * These are the available options for this widget.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * @type {Array.<jQuery>}
				 */
				"fieldList": []
			},
			/**
			 * Initialize this error proxy
			 */
			"_create": function () {
				var field_list	= this.options.fieldList,
				handler			= $.proxy(this, "handleElementValidationFailedEvent"),
				index;
				
				for (index = 0; index < field_list.length; index += 1) {
					field_list[index].bind(EventHelper.validation.failed, handler);
				}
				$.cjaf.form_listener_error_message.prototype._create.apply(this, arguments);
			},
			/**
			 * Function to handle the validation failed event.
			 * @param {jQuery.Event} event
			 * @param {string} error_code
			 * @return {boolean}
			 */
			"handleElementValidationFailedEvent": function (event, error_code) {
				var el	= $(event.target);
				
				if (typeof el.translate === 'function') {
					error_code	= el.translate(error_code);
				}
				this.addError(error_code);
			}
		});
	});
}(jQuery, cjaf));