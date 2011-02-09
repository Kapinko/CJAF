/**
 * This is the place where all necessary customizations to the jQueryUI widget
 * framework are made
 */
/*jslint nomen: false*/
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget', [
		'cjaf/global',
		'cjaf/request'
	],
	/**
	 * @param {cjaf.Global} Global
	 * @param {cjaf.Request} Request
	 */
	function (Global, Request) {
		/**
		 * Obtain a rendered view for this widget.
		 * @param {string} view
		 * @param {*} data
		 */
		$.Widget.prototype._view	= function (view, data) {
			var o		= this.options,
			partials	= null,
			options, locale;

			if (this.options.initView && arguments.length < 2) {
				options	= o.initView;

				if (view !== "string") {
					data	= view;
				}
				
			} else {
				if (typeof view !== 'string') {
					data	= view;
					view	= cjaf.View.getDefault();
				}
				options	= {
					"name": this.widgetName.split('_').join('/'),
					"view": view
				};
			}
			
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
				data	= $.extend(true, Global.localize(locale), data);
			}
			
			return cjaf.view(options, data, partials);
		};

		$.Widget.prototype._getRequest	= function () {
			return Request;
		}
	});
}(jQuery, cjaf));