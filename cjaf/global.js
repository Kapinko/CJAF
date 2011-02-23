/**
 * This is an object that will load the globalization strings for a given
 * widget.
 */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/global', [
		'jQuery/global/jquery.global'
	],
	function () {
		var already_loaded	= {},
		jGlobal	= $.global,
		make_path	= function (widget, locale, base_path) {
			var path, file;
			
			file	= locale.split('-').join('.') + '.json';
			widget	= widget.split('_').join('/');
			path	= [base_path, widget, file].join('/');

			return path;
		},
		load		= function (widget, locale, base_path, is_default) {
			var path	= make_path(widget, locale, base_path), load_ok = true;

			if (!already_loaded[path]) {
				$.ajax({
					url: path,
					dataType: 'json',
					method: 'GET',
					async: false,
					success: function (response, status, XMLHttpRequest) {
						jGlobal.localize(widget, locale, response);
						already_loaded[path]	= true;
						load_ok	= true;
					},
					failure: function (XMLHttpRequest, status, errorThrown) {
						load_ok	= false;
					}
				});
			}

			return load_ok;
		},
		get_currency_symbol	= function (currency) {
			var symbol;
			//@todo add lookup for different currencies
			switch(currency) {
			case "EUR":
				symbol	= "&euro;";
				break;
			case "GBP":
				symbol	= "&pound;";
				break;
			case "JPY":
			case "CNY":
				symbol	= "&yen;";
				break;
			case "JMD":
				symbol	= "J$";
				break;
			case "ZWL":
				symbol	= "Z$";
				break;
			case "PLN":
				symbol	= "PLN";
				break;
			case "MXN":
			case "USD":
			default:
				symbol	= "$";
			}
			
			return symbol;
		},
		set_jquery_locale	= function (locale) {
			var path	= "js/lib/jquery/global/globinfo/jquery.glob." + locale;

			if (!already_loaded[path]) {
				$.ajax({
					"url": path + ".js",
					"dataType": "script",
					"async": false,
					"success": function () {
						already_loaded[path]	= true;
					}
				});
			}
		},
		Global	= cjaf.namespace('Global', {
			/**
			 * This is the base locale. The translation strings will always be
			 * loaded for this locale.
			 * @type {string}
			 */
			default_locale: "en-US",
			/**
			 * This is the currently selected locale
			 * @type {string}
			 */
			locale: "en-US",
			/**
			 * This is the currently selected currency format.
			 * @type {string}
			 */
			currency_type: "USD",
			/**
			 * This is the base path for localization files.
			 * @type {string}
			 */
			base_path: null,
			/**
			 * Get the default locale
			 * @return {string}
			 */
			"getDefaultLocale": function () {
				return this.default_locale;
			},
			/**
			 * Set the default locale
			 * @param {string} locale
			 * @return {Global}
			 */
			"setDefaultLocale": function (locale) {
				this.default_locale	= locale;
				return this;
			},
			/**
			 * Set the current locale.
			 * @param {string} locale
			 * @return {Global}
			 */
			"setLocale": function (locale) {
				set_jquery_locale(locale);
				this.locale	= locale;
				return this;
			},
			/**
			 * Get the currently set locale.
			 * @return {string}
			 */
			"getLocale": function () {
				if (!this.locale) {
					this.locale	= this.getDefaultLocale();
				}
				return this.locale;
			},
			/**
			 * Set the current currency format
			 * @param {string} type
			 * @return {Global}
			 */
			"setCurrency": function (type) {
				this.currency_type	= type;
				return this;
			},
			/**
			 * Get the current currency format
			 * @return {string}
			 */
			"getCurrency": function () {
				return this.currency_type;
			},
			/**
			 * Set the base path for localization files.
			 * @param {string} path
			 * @return {Global}
			 */
			"setBasePath": function (path) {
				this.base_path	= path;
				return this;
			},
			/**
			 * Get the base path for localization file.
			 * @return {string}
			 */
			"getBasePath": function () {
				if (!this.base_path) {
					throw "Localization Base Path has not been set.";
				}
				return this.base_path;
			},
			/**
			 * Get the localization strings for the given widget. You can
			 * optionally specify the locale.
			 * @param {string} widget
			 * @param {string} locale
			 * @return {*}
			 */
			"localize": function (widget, locale) {
				if (!locale) {
					locale	= this.getLocale();
				}
				
				var default_locale	= this.getDefaultLocale(),
				base_path			= this.getBasePath(),
				localized;
				
				
				load(widget, locale, base_path);

				localized	= jGlobal.localize(widget, locale);
				
				if (locale !== default_locale) {
					load(widget, default_locale, base_path, true);
				}
				
				localized	= $.extend(true, {}, jGlobal.localize(widget, default_locale), localized);

				return localized;
			},
			/**
			 * Format the given string or number into a currency value for
			 * the given locale using the given currency.
			 * @param {string|number} value
			 * @param {string} locale
			 * @param {string} currency (defaults to US. dollars "$")
			 */
			"currency": function (value, locale, currency) {
				if (!currency) {
					currency	= this.getCurrency()
				}
				if (!locale) {
					locale	= this.getLocale();
				}

				value		= jGlobal.parseFloat(value.toString(), 10);

				var symbol	= get_currency_symbol(currency),
				formatted	= symbol + jGlobal.format(value, "n2", locale);

				return formatted;
			},
			/**
			 * Parse and format the given string into a date representation for
			 * the given locale.
			 * @param {string} date
			 * @param {string} locale
			 */
			"parseDate": function (date, custom_formats, locale) {
				if (!locale) {
					locale	= this.getDefaultLocale();
				}
				return jGlobal.parseDate(date, custom_formats, locale);
			},
			/**
			 * Format the given date object according to the given format.
			 * @param {Date} date
			 * @param {string} format
			 */
			"formatDate": function (date, format) {
				if (typeof date === 'number') {
					date	= new Date(date * 1000);
				}

				return jGlobal.format(date, format, this.getLocale());
			}
		});
		
		return Global;
	});
}(jQuery, cjaf));