/**
 * This is a formatter that will format the given grid cell value to a currency
 * string.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/grid/formatter/date", [
		'cjaf/global'
	],
	/**
	 * @param {cjaf.Global} i18n
	 * @return {cjaf.Grid.Formatter.Currency}
	 */
	function (i18n) {
		/**
		 * @param {string|number} value
		 * @param {Object.<string, *>} options
		 * @param {Object.<string, *>} row
		 * @return {string}
		 */
		return cjaf.namespace("Grid.Formatter.Date", function (value, options, row) {
			var date	= i18n.parseDate(value, ["yyyy-MM-dd HH:mm:ss"]), format;

			if (options.colModel.hasOwnProperty("formatoptions")) {
				format	= options.colModel.formatoptions.format;
			}

			if (format) {
				date	= i18n.formatDate(date, format);
			}

			return date
		});
	});
}(jQuery, cjaf));