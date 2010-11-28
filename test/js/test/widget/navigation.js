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
				 * This is the full path to the initialization view for this
				 * widget.  In this base class it is not set because it is
				 * assumed that the user will want to provide their own.
				 * @type {string}
				 */
				"initViewPath": '/test/js/test/view/navigation/init.ejs',
				/**
				 * This is the locale object that will be passed to the
				 * initialization view template for this widget.
				 * @type {Object.<string,*>}
				 */
				"locale": base_locale.navigation,
				/**
				 * This is the jQuery object that will be used as a template 
				 * for the individual navigation items.
				 * @type {jQuery}
				 */
				"itemTemplate": $('<li></li>'),
				/**
				 * This is the view template that will be used to create
				 * each navigation item.
				 * @type {string}
				 */
				"itemViewTemplate": '/test/js/test/view/navigation/item/init.ejs',
				/**
				 * This is the selector that will be used to locate the link
				 * list container within the navigation menu skeleton.
				 * @type {string}
				 */
				"listContainerSelector": '.nav-primary-menu',
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