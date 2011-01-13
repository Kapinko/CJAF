/**
 * This is a formatter that will format the given grid cell value to a currency
 * string.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/grid/formatter/currency", [
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
		return cjaf.namespace("Grid.Formatter.Currency", function (value, options, row) {
			return i18n.currency(value);
		});
	});
}(jQuery, cjaf));