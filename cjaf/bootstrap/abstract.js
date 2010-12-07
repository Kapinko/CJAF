/**
 * This is the abstract boostrap class. This class is meant to start-up your application.
 * For each of your application's you will need to have a bootstrap implementation for it.
 */

/** JSLint Declarations */
/*global window: false, jQuery: false, cjaf: false, alert: false */
/*jslint nomen: false */

(function ($, cjaf, window) {
	cjaf.define('cjaf/bootstrap/abstract', [],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 * @return {AbstractBootstrap}
	 */
	function (EventHelper) {
		var document		= window.document,
		AbstractBootstrap	= function () {};
		AbstractBootstrap.prototype	= new cjaf.Bootstrap();
		$.extend(AbstractBootstrap.prototype, {
			/**
			 * This is the function that will be called after the application
			 * has been fully intialized.
			 *
			 * @param {jQuery} cornerstone
			 */
			"run": function (cornerstone) {
				try {
					this._initView();
					
					this._initLayout(cornerstone);

					this._initDispatcher(cornerstone);

					this._startDispatcher();

				} catch (exception) {
					this._handleBootstrapException(exception);
				}
			},
			/**
			 * Here we initialize the view renderer.
			 */
			"_initView": function () {
				var config	= this.getViewConfig(), path, renderer;
				
				path		= config.base_path;
				renderer	= new config.renderer();
				
				cjaf.view	= cjaf.View(path, renderer, config);
			},
			/**
			 * Here we initialize the site layout.
			 */
			"_initLayout": function (cornerstone) {
				this._preLayout(cornerstone);

				var layout_widget	= this._getLayoutWidgetName(),
					layout_config	= this._getLayoutConfig();

				if (typeof cornerstone[layout_widget] !== 'function') {
					throw "The layout widget named: " + layout_widget + " does not exist.";
				}

				cornerstone[layout_widget](layout_config);

				this._postLayout(cornerstone);
			},
			/**
			 * This function initializes the dispatcher and attaches it to the
			 * DOM
			 *
			 * @param {jQuery} cornerstone
			 */
			"_initDispatcher": function (cornerstone) {
				var page, map, el, notifier;
				page	= this._getDefaultPageId();

				if (!page) {
					throw "You must provide a default page identifier through via the _getDefaultPageId function.";
				}

				map		= this._getPageMap();

				if (!map || map.length < 1) {
					throw "You must provide a page map through the _getPageMap function.";
				}

				el		= this._getContentElement(cornerstone);

				if (!el || !el.selector || el.length < 1) {
					throw "You must provide a valid jQuery wrapped element via the _getContentElement function.";
				}
				
				notifier	= new cjaf.Dispatcher.Page.Notifier($(document));
				
				$(document).dispatcher({
					defaultPage:	page,
					pages:			map,
					contentElement: el //Antonio Banderas
				});
				$(document).dispatcher("setCachedEvent", {"page": notifier.getCurrentPage()});
				this._registerDispatcherPlugins($(document), cornerstone);
			},
			/**
			 * This function starts the dispatch loop.
			 */
			"_startDispatcher": function () {
				$(document).dispatcher('render');
			},
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
				throw "getDependencies is an abstract function that must be overridden.";
			},
			/**
			 * This function must return the configuration for the cjaf.view object.
			 * @return {Object.<string,*>}
			 */
			"getViewConfig": function () {
				return {
					/**
					 * This is the file that will be retrieved when the user does
					 * not provide a file name to the cjaf.view function.
					 * @type {string}
					 */
					"default_view": 'init.phtml',
					/**
					 * This is the absolute path that will be used as the base path
					 * for all view template retrievals.
					 * @type {string}
					 */
					"base_path": '/js/view',
					/**
					 * This is the view renderer object we will use to render view
					 * templates.
					 * @type {ViewRenderer}
					 */
					"renderer": cjaf.View.Renderer
				};
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
				return 'template';
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
				throw "_getDefaultPageId is an abstract function that must be overridden.";
			},
			/**
			 * This function must return a map of the page identifiers to the
			 * page widgets that should be loaded. This will be passed directly
			 * to the dispatcher widget.
			 *
			 * @return {Object.<string, string>}
			 */
			"_getPageMap": function () {
				throw "_getPageMap is an abstract function that must be overridden.";
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
				throw "_getContentElement is an abstract function that must be overridden.";
			},
			/**
			 * This function is where you should register all necessary dispatcher
			 * plugins.
			 *
			 * @param {jQuery} container the element where the dispatcher is attached.
			 */
			"_registerDispatcherPlugins": function (container) {},
			/**
			 * This is the Bootstrap error handling function. If an exception
			 * is thrown this will be the last line of defense.
			 *
			 * @param {*} exception
			 */
			"_handleBootstrapException": function (exception) {
				(function () {
					var display	= '',
						type	= typeof exception, x;
						
					if (type === "string") {
						display = exception;
					} else {
						for (x in exception) {
							if (exception.hasOwnProperty(x)) {
								display += exception[x] + "\n";
							}
						}
					}
					
					alert(display);
				}());
			}
		});
		return AbstractBootstrap;
	});
}(jQuery, cjaf, window));