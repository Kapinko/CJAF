/**
 * This is a helper object to assist widgets in event handling.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/helper/event', [
		'cjaf/widget/helper'
	],
	/**
	 * @param {cjaf.Widget.Helper} Helper
	 * @return {cjaf.Widget.Helper.Event}
	 */
	function (Helper) {
		/**
		 * This is a helper object to assist in event handling.
		 */
		Helper.Event	= function() {
			/**
			 * Events related to errors.
			 * @type {Object.<string,string>}
			 */
			this.error	= {
				/**
				 * This is the event for an HTTP error
				 * @type {string}
				 */
				"http": "error_http"
			};
		}
	});
}(jQuery, cjaf));