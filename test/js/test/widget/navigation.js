/**
 * This is the main navigation widget for the CJAF Test Framework.
 */
/** JSLint declarations */
/*global jQuery:false, cjaf:false*/
/*jslint nomen:false*/
(function ($, cjaf) {
	cjaf.define('test/widget/navigation', [
		'cjaf/global',
		'core/widget/navigation'
	],
	function (Global) {
		$.widget('cjaf.test_navigation', $.cjaf.core_navigation, {
			/**
			 * These are the available options and their default settings.
			 * @type {Object.<string, *>}
			 */
			options: {
				/**
				 * This is the locale object that will be passed to the
				 * initialization view template for this widget.
				 * @type {Object.<string,*>}
				 */
				"locale": null,
				/**
				 *This is the class that should be applied to a navigation item
				 *to denote that it is the currently selected option.
				 * @type {string}
				 */
				"selectedClass": 'current-page'
			},
			_create: function () {
				if (!this.options.locale) {
					this.options.locale	= Global.localize(this.widgetName).navigation;
				}
				$.cjaf.core_navigation.prototype._create.apply(this, arguments);
			}
		});
	});
}(jQuery, cjaf));