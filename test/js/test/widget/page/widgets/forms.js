/**
 * This is a page to test all of the form widgets.
 */
/*jslint nomen: false*/
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('test/widget/page/widgets/forms', [
		'test/widget/form/formulator'
	],
	function (locale) {
		$.widget("cjaf.test_page_widgets_forms", {
			options: {},
			_create: function () {
				var el	= this.element;
				
				el.html(this._view({}));
				$("#test-form").test_form_formulator();
			}
		});
	});
}(jQuery, cjaf));