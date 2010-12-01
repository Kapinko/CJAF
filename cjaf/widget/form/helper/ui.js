/**
 * This is a form helper object that represents the form user interface.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/helper/ui', [
		'cjaf/widget/form/helper',
		'cjaf/widget/form/helper/event'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper} FormHelper
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 * @return {cjaf.Widget.Form.Helper.UI}
	 */
	function (FormHelper, EventHelper) {
		/**
		 * This is a form helper object that handles all of the form UI elments.
		 * @param {jQuery} form
		 * @constructor
		 */
		FormHelper.UI	= function (form) {
			if (!this.element.is('form')) {
				throw "You must provide a form widget to the form UI helper.";
			}
			
			/**
			 * This is the form element that we're dealing with.
			 * @type {jQuery}
			 */
			this.form	= form;
			/**
			 * This is a list of all the elements in this form.
			 * @type {Array.<jQuery>}
			 */
			this.element_list	= [];
		};
		$.extend(FormHelper.UI.prototype, {
			/**
			 * Add an element to this form.
			 * @param {jQuery} el
			 * @return {FormHelper.UI}
			 */
			"addElement": function (el) {
				var handler	= this.form('getEventHandler');
				
				el.form_element('setForm', this.form);
				el.bind(EventHelper.validation.failed, $.proxy(handler, "handleElementValidationFailure"));
				el.bind(EventHelper.validation.success, $.proxy(handler, "handleElementValidationSuccess"));
				
				return this;
			},
			/**
			 * Set up this form to conform the the jQueryUI framework.
			 * @param {jQuery} form
			 * @return {FormHelper.UI}
			 */
			"setUpForm": function (form) {
				form.attr('action', 'javascript:;')
					.attr('method', 'POST')
					.addClass('ui-widget-content ui-corner-all');
					
				return form;
			}
		});
	});
}(jQuery, cjaf));