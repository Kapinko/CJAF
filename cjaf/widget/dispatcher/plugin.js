/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/dispatcher/plugin', [
	],
	function () {
		cjaf.DispatcherPlugin	= function () {
			
		};
		$.extend(cjaf.DispatcherPlugin.prototype, {
			/**
			 * @param {jQuery} target_el
			 * @param {string} current_page
			 * @param {string} target_page
			 * @return {bool}
			 */
			preRender: function (target_el, current_page, target_page) {
				return true;
			},
			/**
			 * @param {jQuery} target_el
			 * @param {string} current_page
			 * @param {string} target_page
			 * @return {bool}
			 */
			preControllerLoad: function (target_el, current_page, target_page) {
				return true;
			},
			/**
			 * @param {jQuery} target_el
			 * @param {string} previous_page
			 * @param {string} current_page
			 * @return {bool}
			 */
			postControllerLoad: function (target_el, previous_page, current_page) {
				return true;
			},
			/**
			 * @param {jQuery} target_el
			 * @param {string} previous_page
			 * @param {string} current_page
			 * @return {bool}
			 */
			postRender: function (target_el, previous_page, current_page) {
				return true;
			}
		});
		
		return $.cjaf.DispatcherPlugin;
	});
}(jQuery, cjaf));