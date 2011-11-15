/**
 * This is the place where all necessary customizations to the jQueryUI widget
 * framework are made
 */
/*jslint nomen: false*/
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget', [
		'cjaf/global',
		'cjaf/request',
		'cjaf/view'
	],
	/**
	 * @param {cjaf.Global} i18n
	 * @param {cjaf.Request} Request
	 */
	function (i18n, Request) {
		/**
		 * Obtain a rendered view for this widget.
		 * @param {string} view
		 * @param {*} data
		 */
		$.Widget.prototype._view	= function (view, data) {
			var o			= this.options,
			partials		= null,
			view_is_string	= typeof view === "string" ? true : false,
			locale;

			if (arguments.length < 2 && !view_is_string) {
				data	= view;
				view	= {
					"name": this.widgetName,
					"view": cjaf.View.getDefault()
				};
			} else if (view_is_string) {
				view	= {
					"name": this.widgetName,
					"view": view
				};
			}

			view.name	= view.name.split("_").join("/");
			
			//If the user has provided custom view data as an option then merge 
			//it in now.
			if (o.view) {
				data	= $.extend(true, data, o.view);
			}
			
			//If the user has listed any partials then set the partials parameter.
			if (o.partials) {
				partials	= o.partials;
			}
			
			//if the user hasn't turned off localization load the string file.
			if (!o.no_locale) {
				if (o.locale) {
					locale	= o.locale;
				} else {
					locale	= this.widgetName;
				}
				data	= $.extend(true, {}, i18n.localize(locale), data);
			}
			
			return cjaf.view(o.initView || view, data, partials);
		};

		$.Widget.prototype._getRequest	= function () {
			return Request;
		};

		/**
		 * Get the locale object for the current widget
		 * @return {Object.<string,Object|string>}
		 */
		$.Widget.prototype._getLocale	= function () {
			return i18n.localize(this.widgetName);
		};
	});
}(jQuery, cjaf));