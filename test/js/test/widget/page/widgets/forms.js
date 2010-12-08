/**
 * This is a page to test all of the form widgets.
 */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('test/widget/page/form', [
		
	],
	function () {
		$.widget("cjaf.test_page_form", {
			options: {
				
			},
			_create: function () {
				var el	= this.element;
				
				el.html(this._view({}));
			}
		});
	});
}(jQuery, cjaf));