/**
 * This is a page to test all of the form widgets.
 */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('test/widget/page/widgets/forms', [
		'i18n!test/nls/Base',
		'test/widget/form/formulator'
	],
	function (locale) {
		$.widget("cjaf.test_page_widgets_forms", {
			options: {
				/**
				 * This is the locale object that will be passed to the
				 * initialization view.
				 * @type {Object.<string,*>}
				 */
				'locale': locale.form_test
			},
			_create: function () {
				var el	= this.element;
				
				el.html(this._view({}));
				$("#test-form").test_form_formulator();
			}
		});
	});
}(jQuery, cjaf));