/**
 * This is a namespace for all form helpers.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/helper', [
		
	],
	/**
	 * @return {cjaf.Form.Helper}
	 */
	function () {
		if (!cjaf.hasOwnProperty('Form')) {
			cjaf.Form	= {};
		}
		if (!cjaf.Form.hasOwnProperty('Helper')) {
			cjaf.Form.Helper	= {};
		}
		
		return cjaf.Form.Helper;
	});
}(jQuery, cjaf));