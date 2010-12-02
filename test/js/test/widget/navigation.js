/**
 * This is the main navigation widget for the CJAF Test Framework.
 */
/** JSLint declarations */
/*global jQuery:false, cjaf:false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('test/widget/navigation', [
		'i18n!test/nls/Base',
		'cjaf/widget/navigation'
	],
	function (base_locale) {
		$.widget('cjaf.test_navigation', $.cjaf.navigation, {
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
				"locale": base_locale.navigation,
				/**
				 *This is the class that should be applied to a navigation item
				 *to denote that it is the currently selected option.
				 * @type {string}
				 */
				"selectedClass": 'current-page'
			}
		});
	});
}(jQuery, cjaf));