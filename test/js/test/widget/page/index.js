/**
 * This is the page controller for the CJAF Test Framework index page.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('test/widget/page/index', [
		
	],
	function () {
		$.widget('cjaf.test_page_index', {
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
				'initViewPath': '/test/js/test/view/page/index/init.ejs',
				/**
				 * This is the locale object that will be passed to the
				 * initialization view.
				 * @type {Object.<string,*>}
				 */
				'locale': {}
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