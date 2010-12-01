/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/dispatcher/plugin', [
	],
	function () {
		/**
		 * This is the constructor for all Dispatcher plugins.
		 * 
		 * @param {jQuery} element
		 * @param {string} widget_name
		 * @param {Object.<string,*>} widget_options
		 * @constructor
		 */
		var Plugin	= function (element, widget_name, widget_options) {
			//Make sure we call init on plugin load.
			this.init.apply(this, arguments);
		}
		$.extend(Plugin.prototype, {
			/**
			 * This is an initialization function that will be called upon 
			 * object construction.
			 * 
			 * @param {jQuery} element
			 * @param {string} widget_name
			 * @param {Object.<string, *>} widget_options
			 */
			init: function (element, widget_name, widget_options) {
				
			},
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
		
		if (!cjaf.hasOwnProperty('Dispatcher')) {
			cjaf.Dispatcher	= {};
		}
		
		cjaf.Dispatcher.Plugin	= Plugin;
		
		return cjaf.Dispatcher.Plugin;
	});
}(jQuery, cjaf));