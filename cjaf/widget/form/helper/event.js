/**
 * This is a container to store all the form event strings. 
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('cjaf/widget/form/helper/event', [],
	/**
	 * @return {cjaf.Form.Helper.Event}
	 */
	function () {
		var Event	= cjaf.namespace("Form.Helper.Event", (function () {
			return {
				/**
				 * These are the events that can occur during the form 
				 * load process.
				 * @type {Object.<string,string>}
				 */
				"load": {
					"initialized": "form_load_initialized",
					"complete": "form_load_complete"
				},
				/**
				 * These are the events that can occur during the form
				 * submission process.
				 * @type {Object.<string,string>}
				 */
				"submit": {
					"client": "form_submit_client",
					"server": "form_submit_server"
				},
				/**
				 * This is the event that occurs when the form is cleared.
				 * @type {string}
				 */
				"clear": "form_clear",
				/**
				 * This is the event that occurs that occurs when the form
				 * has been submitted successfully.
				 * @type {string}
				 */
				"success": "form_success",
				/**
				 * This is the event that occurs when there is an error 
				 * during the form submission process.
				 * @type {string}
				 */
				"error": "form_error",
				/**
				 * These are the events that occur during the form 
				 * validation process.
				 * @type {Object.<string,string>}
				 */
				"validation": {
					"start": "form_validation_start",
					"failed": "form_validation_failed",
					"success": "form_validation_success"
				},
				/**
				 * These are the events that can occur on individual form
				 * elements.
				 * @type {Object.<string,string>}
				 */
				"element": {
					"clear": "form_element_clear"
				}
			};
		}()));
		return Event;
	});
}(jQuery, cjaf));