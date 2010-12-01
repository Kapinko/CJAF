/**
 * This is a namespace for the model factory objects.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/model/factory', [
		'cjaf/model'
	],
	/**
	 * @param {cjaf.Model} Model
	 * @return {cjaf.Factory}
	 */
	function (Model) {
		if (!Model.hasOwnProperty('Factory')) {
			Model.Factory	= {};
		}
		
		return Model.Factory;
	});
}(jQuery, cjaf));