/**
 * This is the base application file that needs to be included inside the base HTML
 * file.  once included it will start up the CJAF application framework.
 */

/** JSLint Declarations */
/*global window: false, document: false, unescape: false, ActiveXObject: false, 
XMLHttpRequest: false, jQuery: false, require: false*/
/*jslint nomen: false */

//Explicitly declare the cjaf global
window.cjaf	= (function ($, require, window, document) {
	if (!require) {
		throw "The CJAF Application framework must have RequireJS available (http://requirejs.org)";
	}
	
	/**
	 * This is the default locale.
	 * @type {string}
	 */
	var DEFAULT_LOCALE		= 'en_US', //default locale is U.S. English.
	/**
	 * where the locale is stored.
	 * @type {string}
	 */
	COOKIE_LOCALE		= 'cjaf.locale',
	/**
	 * This is the URL that will be used as the default requireJS "baseUrl".
	 * @type {string}
	 */
	DEFAULT_BASE_URL	= '/js',
	/**
	 * These are the default paths that are set up for your application.
	 * @type {Object.<string, string>}
	 */
	DEFAULT_PATHS		= {
		"cjaf": "cjaf",
		"lib": "lib",
		"jQuery": "lib/jquery",
		"jQueryUI": "lib/jquery/ui"
	},
	/**
	 * Thes are the default dependencies common to every cjaf application.
	 * @type {Array.<string>}
	 */
	DEFAULT_DEPENDENCIES	= [
		'cjaf/class',
		'cjaf/namespace',
		'cjaf/view',
		'cjaf/model',
		'cjaf/view/renderer',
		'cjaf/widget/dispatcher',
		'cjaf/widget/template'
	],

	/**
	 * Function taken from the w3schools page. This is used to retrieve
	 * the locale cookie.
	 *
	 * @see http://www.w3schools.com/js/js_cookies.asp
	 * @return {string}
	 */
	getCookie = function (name) {
		var value = "",
		start_index = -1,
		end_index	= null,
		cookie = document.cookie;

		if (cookie.length > 0) {
			start_index = cookie.indexOf(name + "=");
		}
		if (start_index !== -1) {
			start_index = start_index + name.length + 1;
			end_index = cookie.indexOf(";", start_index);

			if (end_index === -1) {
				end_index = cookie.length;
			}
			value = unescape(cookie.substring(start_index, end_index));
		}
		return value;
	},
	/**
	 * This function will retrieve the current locale from the "cjaf.locale"
	 * cookie.
	 * @return {string}
	 */
	getLocale	= function () {
		var locale	= getCookie(COOKIE_LOCALE);

		if (!locale) {
			locale	= DEFAULT_LOCALE;
		}
		window.LocaleSetting	= locale;
		return locale;
	},

	//Create the CJAF namespace
	cjaf	= {
		/**
		 * This is the current locale setting.
		 * @type {string}
		 */
		'LOCALE': getLocale(),
		/**
		 * Function to load any dependencies before executing the callback.
		 * This is just a hide of the requireJS functionality in case we
		 * need to override something it does.
		 *
		 * @param {Array.<string>} dependencies
		 * @param {function(*)} callback
		 */
		'require': function (dependencies, callback) {
			require(dependencies, callback);
		},
		/**
		 * Function to define a module that can be loaded through the require 
		 * function. Just a hide of the requireJS functionality in case we
		 * need to override something it does.
		 * 
		 * @param {string} module_name,
		 * @param {Array.<string>} dependencies
		 * @param {function} callback
		 */
		'define': function (module_name, dependencies, callback) {
			require.def(module_name, dependencies, callback);
		}
	};
	/**
	 * This is the base bootstrap class. Each CJAF application will need a
	 * bootstrap file to start it up.
	 * @constructor
	 */
	cjaf.Bootstrap	= function () {};
	cjaf.Bootstrap.prototype	= {
		/**
		 * This function is the first thing called in the application
		 * initialization process. Note at this point you will not
		 * have any dependencies loaded other than those you explicitly
		 * require yourself.
		 */
		"init": function () {},
		/**
		 * This function is what will be called upon application initialization.
		 */
		"run": function () {
			throw "This is an abstract function, it must be overridden.";
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
			return [];
		},
		/**
		 * This function should return your applications base URL.
		 * @return {string} base_url
		 */
		"getBaseUrl": function () {
			return DEFAULT_BASE_URL;
		},
		/**
		 * This function should return any custom requireJS paths that your
		 * application needs.
		 * @return {Object.<string, string>}
		 */
		"getCustomPaths": function () {
			return {};
		},
		/**
		 * This function returns the currently set locale.
		 * @return {string}
		 */
		"getLocale": function () {
			return cjaf.LOCALE;
		}
	};
	/**
	 * This is the CJAF Application object that will control the application as
	 * a whole. IE to start up the application call cjaf.Application.start();
	 */
	cjaf.Appplication	= (function () {
			/**
			 * This function will run just prior to calling the bootstraps
			 * init() function. Here we perform any customizations to our libraries.
			 */
			var _preInit	= function () {
				//Override jQuery's default XHR so that IE8 does not crash.
				$.ajaxSetup({
					xhr: function () {
						var xmlHttp;

						try {
							//[Sane] Firefox, Opera 8.0+, Safari/Webkit
							xmlHttp	= new XMLHttpRequest();
						} catch (XMLHttpRequestNotFoundException) {
							//[Insane] Internet Exploder
							try {
								xmlHttp	= new ActiveXObject("MSXML2.XMLHTTP");
							} catch (MSXML2ObjectNotFoundException) {
								try {
									xmlHttp	= new ActiveXObject("Microsoft.XMLHTTP");
								} catch (XMLHttpRequestNotSupportedException) {
									xmlHttp	= false;
								}
							}
						}
						return xmlHttp;
					}

				});
			},
			/**
			 * This function will create a requireJS config base upon information
			 * it pulls from your Bootstrap object.
			 * @param {cjaf.Bootstrap} Bootstrap
			 * @return {Object}
			 */
			_createRequireJSConfig	= function (Bootstrap) {
				var config	= {
					baseUrl: Bootstrap.getBaseUrl(),
					paths: $.extend({}, DEFAULT_PATHS, Bootstrap.getCustomPaths()),
					locale: Bootstrap.getLocale()
				};
				return config;
			},
			/**
			 * This function will pull merge the default dependencies with those
			 * provided by your application's bootstrap.
			 * @param {cjaf.Bootstrap} Bootstrap
			 * @return {Array.<string>}
			 */
			_getMergedDependencies	= function (Bootstrap) {
				var defaultDeps	= DEFAULT_DEPENDENCIES,
					yourDeps	= Bootstrap.getDependencies();

				return defaultDeps.concat(yourDeps);
			},
			/**
			 * This function will remove the current content from the 'body' tag
			 * (with fancy fade of course :) and replace it with the cornerstone
			 * element and all of it's associated content.
			 *
			 * @param {jQuery} cornerstone
			 * @param {jQuery} elements_to_clear
			 */
			_showApplication	= function (cornerstone, elements_to_clear) {
				var show_cornerstone	= function () {
					cornerstone.fadeIn('normal');
				};
				
				if (!elements_to_clear || elements_to_clear.length < 1) {
					show_cornerstone();
					
				} else {
					elements_to_clear.fadeOut('normal', function () {
						show_cornerstone();
					});
				}
			};

			return {
				/**
				 * This will start up a CJAF application using the given bootstrap file.
				 *
				 * @type {string} bootstrap_path - this must be the full path to your
				 *				application's bootstrap file.
				 * @type {jQuery} cornerstone - This is the jQuery wrapped element 
				 *				that the base layout will be attached to.
				 * @type {jQuery} elements_to_clear - This is the jQuery wrapped list
				 *				of elements that we will clear when we're ready to
				 *				display the application.
				 * @type {string} base_url - this is the base URL for all requirejs requests.
				 */
				"start": function (bootstrap_path, cornerstone, elements_to_clear, base_url) {
					if (!base_url) {
						base_url	= DEFAULT_BASE_URL;
					}
					require({baseUrl: base_url});
					
					require([
						bootstrap_path
					],
					/**
					 * @param {cjaf.Bootstrap} ApplicationBootstrap
					 */
					function (ApplicationBootstrap) {
						var Bootstrap	= new ApplicationBootstrap(),
							config, dependencies;

						if (!(Bootstrap instanceof cjaf.Bootstrap)) {
							throw "Invalid bootstrap path. Object must be an instance of cjaf.Bootstrap";
						}
						if (cornerstone.length !== 1 || !cornerstone.selector) {
							throw "Invalid application container element.";
						}
						cornerstone.fadeOut('normal', function () {
							cornerstone.css('display', 'none');

							//Run the preInit to customize our setup.
							_preInit();

							//Perform any bootstrap initialization work.
							Bootstrap.init();

							config			= _createRequireJSConfig(Bootstrap);
							dependencies	= _getMergedDependencies(Bootstrap);

							//configure require
							require(config);

							//start the application.
							require(dependencies, 
								function () {
									require.ready(function () {
										Bootstrap.run(cornerstone);
										_showApplication(cornerstone, elements_to_clear);
									});
								});
						});
						
					});
				}
			};
		}());
		
	return cjaf;
}(jQuery, require, window, window.document));