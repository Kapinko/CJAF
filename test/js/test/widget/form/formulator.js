/**
 * This is the page controller for the CJAF Test Framework index page.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('test/widget/form/formulator', [
		'cjaf/widget/form',
		'cjaf/widget/form/helper/handler'
	],
	function (EventHandler) {
		$.widget('cjaf.test_form_formulator', $.cjaf.form,  {
			/**
			 * These are the available options and their defaults for this
			 * widget.
			 * @type {Object.<string, *>}
			 */
			options: {

				/**
				 * This is the full path to the initialization view for this
				 * widget.
				 * @type {string}
				 */
				'initViewPath': '/test/js/test/view/page/widget/init.ejs',

				/**
				 * This should be set to the jQuery object that will trigger a
				 * form submit.
				 * @type {jQuery}
				 */
				"submitTrigger": null,
				/**
				 * This should be set to the jQuery object that will trigger a
				 * form clear/reset
				 * @type {jQuery}
				 */
				"clearTrigger": null,
				/**
				 * Should we only show one error per field?
				 * @type {boolean}
				 */
				"singleErrorPerField": true,
				/**
				 * This object will be used as the error locale string lookup
				 * object.
				 * @type {Object.<string,*>}
				 */
				"errorLocale": null,
				/**
				 * This can be used to disable the client side validation
				 * programmatically.  Normally this is handled through a
				 * cookie.
				 */
				"disableClientSideValidation": true,
				/**
				 * Get the event handler helper class for this form widget.
				 * @type {cjaf.Widget.Form.Helper.Handler}
				 */
				"eventHandler": cjaf.Class.extend(EventHandler,{

				}),
				/**
				 * This function should add all of the necessary elements
				 * to this form.
				 * @type {function(cjaf.Widget.Form.Helper.UI)}
				 */
				"initFormElements": function (form_ui) {
					throw "You must provide a initFormElements function.";
				}
			},
			/**
			 * The initialization function for this widget.
			 */
			_create: function () {
				var o	= this.options;
				
				this.element.html(cjaf.view(o.initViewPath, o.locale));
			}
		});
	});
}(jQuery, cjaf));