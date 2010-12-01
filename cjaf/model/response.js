/**
 * This is a namespace for the model response objects.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/model/response', [
		'cjaf/model'
	],
	/**
	 * @param {cjaf.Model} Model
	 * @return {cjaf.Response}
	 */
	function (Model) {
		if (!Model.hasOwnProperty('Response')) {
			Model.Response	= {};
		}
		
		return Model.Response;
	});
}(jQuery, cjaf));