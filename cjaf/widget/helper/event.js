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
			return {
				/**
				 * Events related to errors.
				 * @type {Object.<string,string>}
				 */
				"error": {
					/**
					 * This is the event for an HTTP error
					 * @type {string}
					 */
					"http": "error_http"
				},
				/**
				 * Events related to access control
				 */
				"access_control": {
					/**
					 * An event that denotes that the access control environment
					 * has changed.
					 * @type {string}
					 */
					"changed": "access_control_changed"
				},
				/**
				 * Events related to the dispatcher
				 * @type {Object.<string,*>}
				 */
				"dispatcher": {
					"content": {
						"change": "page_content_change",
						"clear": {
							"start": "page_content_clear_start",
							"complete": "page_content_clear_complete"
						},
						"render": {
							"start": "page_content_render_start",
							"complete": "page_content_render_complete"
						},
						"transition": {
							"out": {
								"complete": "page_content_transition_out_complete"
							},
							"in": {
								"complete": "page_content_transition_in_complete"
							}
						},
						"widget": {
							"preload": {
								"complete": "page_content_widget_preload_complete"
							},
							"load": {
								"start": "page_content_widget_load_start",
								"complete": "page_content_widget_load_complete"
							},
							"postload": {
								"complete": "page_content_widget_postload_complete"
							}
						}
					}
				},
				/**
				 * Events related to form elements
				 * @type {Object.<string,*>}
				 */
				"form_element": {
					"error": "form_element_error",
					"clear": "form_element_clear"
				},
				/**
				 * Events related to lists.
				 * @type {Object.<string,*>}
				 */
				"list": {
					"criteria": {
						"changed": "list_criteria_changed"
					},
					"render": {
						"complete": "list_render_complete"
					}
				}
			};
		}();

		return Helper.Event;
	});
}(jQuery, cjaf));