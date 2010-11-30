/**
 * A widget in the cjaf framework can roughly be mapped to a controller in the
 * classical MVC (Model-View-Controller) pattern
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget', [
		
	],
	function () {
		//Make sure that the "Widget" namespace is defined."
		if (!cjaf.hasOwnProperty('Widget')) {
			cjaf.Widget	= {};
		}
		
		return cjaf.Widget;
	});
}(jQuery, cjaf));