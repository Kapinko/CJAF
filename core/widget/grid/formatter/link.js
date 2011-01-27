/**
 * This is a formatter that will format the given grid cell value to a currency
 * string.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/grid/formatter/link", [
		
	],
	/**
	 * @param {cjaf.Global} i18n
	 * @return {cjaf.Grid.Formatter.Currency}
	 */
	function () {
		/**
		 * @param {string|number} value
		 * @param {Object.<string, *>} options
		 * @param {Object.<string, *>} row
		 * @return {string}
		 */
		return cjaf.namespace("Grid.Formatter.Link", function (value, options, row) {
			var base_url	= options.colModel.formatoptions.baseLinkUrl;
			return "<a href=\"" + base_url + "?id=" + value + "\">" + value + "</a>";
		});
	});
}(jQuery, cjaf));