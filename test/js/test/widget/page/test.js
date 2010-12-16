/**
 * This is a test sub page.
 */
/*jslint nomen: false*/
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('cjaf/test/widget/page/test', [],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 */
	function () {
		$.widget('cjaf.test_page_test', {
			options: {

			},
			_create: function () {
				this.element.html(this._view({}));
			}
		});
	});
}(jQuery, cjaf));