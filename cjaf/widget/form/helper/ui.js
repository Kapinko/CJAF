/**
 * This is a form helper object that represents the form user interface.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/helper/ui', [
		'cjaf/widget/form/helper/event'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 * @return {cjaf.Widget.Form.Helper.UI}
	 */
	function (EventHelper) {
		/**
		 * This is a form helper object that handles all of the form UI elments.
		 * @param {jQuery} form
		 * @param {string} widget_name
		 * @constructor
		 */
		var UI	= cjaf.namespace("Form.Helper.UI", function (form, widget_name) {
			if (!form.is('form')) {
				throw "You must provide a form widget to the form UI helper.";
			}
			
			/**
			 * This is the form element that we're dealing with.
			 * @type {jQuery}
			 */
			this.form	= form;
			/**
			 * This is the name of the form widget name
			 * @type {string}
			 */
			this.widget_name	= widget_name;
			/**
			 * This is a list of all the elements in this form.
			 * @type {Array.<jQuery>}
			 */
			this.element_list	= [];
								 
			this.setUpForm(this.form);
		});
		UI.prototype	= {
			/**
			 * Add an element to this form.
			 * @param {jQuery} el
			 * @return {FormHelper.UI}
			 */
			"addElement": function (el) {
				var handler	= this.form[this.widget_name]('getEventHandler');
				
				el.form_element('setForm', this.form);
				el.bind(EventHelper.validation.failed, $.proxy(handler, "handleElementValidationFailure"));
				el.bind(EventHelper.validation.success, $.proxy(handler, "handleElementValidationSuccess"));
				this.element_list.push(el);
				
				return this;
			},

			"getElementList": function () {
				return this.element_list;
			},


			/**
			 * Set up this form to conform the the jQueryUI framework.
			 * @param {jQuery} form
			 * @return {FormHelper.UI}
			 */
			"setUpForm": function (form) {
				form.attr('action', '#')
					.attr('method', 'POST');
					
				return form;
			}
		};

		return UI;
	});
}(jQuery, cjaf));