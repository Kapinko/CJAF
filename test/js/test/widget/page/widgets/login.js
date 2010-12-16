/**
 * This is a page to test login components.
 */
/*jslint nomen: false*/
/*global jQuery:false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('test/widget/page/widgets/login', [
		'core/widget/captcha'
	],
	function () {
		$.widget('cjaf.test_page_widgets_login', {

			_create: function () {
				var el	= this.element;
				this.element.html(this._view({}));

				this._captchaTest();
			},
			_captchaTest: function () {
				this.element.find('#captcha-test').core_captcha();
			}
		});
	});
}(jQuery, cjaf));