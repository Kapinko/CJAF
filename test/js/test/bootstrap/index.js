/**
 * This is the bootstrap file for the unit test framework.
 */

/** JSLint Declarations */
/*global jQuery: false, cjaf: false */
/*jslint nomen: false*/

(function ($, cjaf) {
	cjaf.define('test/bootstrap/index', [
		'cjaf/bootstrap/abstract'
	],
	/**
	 * @param {AbstractBootstrap} AbstractBootstrap
	 * @return {cjaf.test.Bootstrap.Index}
	 */
	function (AbstractBootstrap) {
		var TestIndexBootstrap	= function () {};
		TestIndexBootstrap.prototype	= new AbstractBootstrap();
		$.extend(TestIndexBootstrap.prototype, {
			/**
			 * This function should return an array of dependencies that are necessary
			 * for your application to run. Since your bootstrap will be initialized
			 * before requireJS has been configured with your applications path setup
			 * you must provide all bootstrap dependencies here. If you do not the
			 * includes will not work as expected due to the lack of a proper path
			 * set up.
			 *
			 * @return {Array.<string>}
			 */
			"getDependencies": function () {
				return [
					'cjaf/widget/dispatcher/plugin/widget_loader',
					
					'test/widget/template',
					'test/widget/page/index',
					'test/widget/page/widgets',
					'test/widget/navigation',
					
					'cjaf/widget/helper/menu/renderer/dock'
				];
			},
			/**
			 * Do any necessary pre-layout work here. This should be where you
			 * customize the cornerstone element to suit your needs.
			 * @param {jQuery} cornerstone
			 */
			"_preLayout": function (cornerstone) {},
			/**
			 * This function must return the accessible name of the layout template
			 * widget to be used for this site.
			 */
			"_getLayoutWidgetName": function () {
				return 'test_template';
			},
			/**
			 * This function must return an object suitable to be passed to the
			 * layout widget constructor.
			 *
			 * @return {Object}
			 */
			"_getLayoutConfig": function () {
				return {};
			},
			/**
			 * This is the function where you should set up all of your site wide
			 * elements (eg, Navigation)
			 *
			 * @param {jQuery} cornerstone
			 */
			"_postLayout": function (cornerstone) {},
			/**
			 * This function must return a valid page id.  The page id will be
			 * passed to the dispatcher to be used as the default page.
			 * @return {string}
			 */
			"_getDefaultPageId": function () {
				return 'home';
			},
			/**
			 * This function must return a map of the page identifiers to the
			 * page widgets that should be loaded. This will be passed directly
			 * to the dispatcher widget.
			 *
			 * @return {Object.<string, string>}
			 */
			"_getPageMap": function () {
				return {
					'home': 'test_page_index',
					'widget': 'test_page_widgets'
				};
			},
			/**
			 * This function must return the content element that the dispatcher
			 * is going to control.
			 *
			 * @param {jQuery} cornerstone - this is the element where the
			 *		layout has been attached to. This element should be used
			 *		as the starting point for your content element query.
			 * @return {jQuery}
			 */
			"_getContentElement": function (cornerstone) {
				return cornerstone.find('#content-main');
			},
			/**
			 * This function is where you should register all necessary dispatcher
			 * plugins.
			 *
			 * @param {jQuery} container the element where the dispatcher is attached.
			 * @param {jQuery} cornerstone the site container element.
			 */
			"_registerDispatcherPlugins": function (container, cornerstone) {
				var options	= {
					"pageList": this._getNavigationPageMap(),
					"renderer": cjaf.Widget.Helper.Menu.Renderer.Dock
				};
				container.dispatcher('registerPlugin', new cjaf.Dispatcher.Plugin.WidgetLoader(cornerstone.find('#nav-primary'), 'test_navigation', options));
			},
			/**
			 * This function should return your applications base URL.
			 * @return {string} base_url
			 */
			"getBaseUrl": function () {
				return '/test/js';
			},
			/**
			 * This function returns the navigation page map.
			 * @return {Object.<string, Object>}
			 */
			_getNavigationPageMap: function () {
				return {
					"home": {
						"image": 'img/crystal_clear_icons/png/128x128/apps/home.png'
					},
					"model": {
						"image": 'img/crystal_clear_icons/png/128x128/apps/database.png'
					},
					"widget": {
						"image": 'img/crystal_clear_icons/png/128x128/apps/warehause.png'
					},
					"base": {
						"image": 'img/crystal_clear_icons/png/128x128/apps/ksirtet.png'
					}
				};
			}
		});
		
		return TestIndexBootstrap;
	});
}(jQuery, cjaf));