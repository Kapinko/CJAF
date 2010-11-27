/**
 * This module defines all of the necessary name spaces for the
 * CJAF model framework.
 */

/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model', [
		
	],
	/**
	 * @return {Object.<string, Object>}
	 */
	function () {
		cjaf.Model	= {
			Factory: {},
			Response: {}
		};
		
		return cjaf.Model;
	});
}(jQuery, cjaf));