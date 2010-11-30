/**
 * Widget helpers are objects used to augment and "help" out widgets in performing
 * their duties.  These are bits of functionality abstracted out.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/helper', [
		'cjaf/widget'
	],
	/**
	 * @param {Object.<string,*>} Widget
	 * @return {Object.<string,*>}
	 */
	function (Widget) {
		/**
		 * Define the widget helper namespace.
		 */
		if (!cjaf.Widget.hasOwnProperty('Helper')) {
			cjaf.Widget.Helper	= {};
		}
		return cjaf.Widget.Helper;
	});
}(jQuery, cjaf));