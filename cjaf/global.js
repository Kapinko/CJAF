/**
 * This is an object that will load the globalization strings for a given
 * widget.
 */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/global', [
		'jQuery/jquery.glob'
	],
	function () {
		var already_loaded	= {},
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
						$.localize(widget, locale, response);
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
				this.locale	= locale;
				return this;
			},
			/**
			 * Get the currently set locale.
			 * @return {string}
			 */
			"getLocale": function () {
				return this.locale;
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
				
				if (locale !== default_locale) {
					load(widget, default_locale, base_path, true);
				}
				
				load(widget, locale, base_path);

				localized	= $.localize(widget, locale);

				if (localized === null) {
					localized	= $.localize(widget, default_locale);
				}

				return localized;
			}
		});
		
		return Global;
	});
}(jQuery, cjaf));