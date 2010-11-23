/** JSLint Declarations */
/*global document: false, jQuery: false, cjaf: false, alert: false */
/*jslint white:true, browser:true, onevar: false, undef: true, eqeqeq:true, plusplus: true,
bitwise: true, regexp: true, newcap: true, immed: true */

(function ($, cjaf) {
	cjaf.define('lib/event/type/map', [

	], function () {
		var map	= {
			"form": {
				'load.initialized': "form_load_initialized",
				'load.complete': "form_load_complete",
				'submit.client': "form_submit_client",
				'submit.server': "form_submit_server",
				'clear': "form_clear",
				'success': "form_success",
				'error': "form_error",
				'validation.failed': "form_validation_failed",
				'validation.success': "form_validation_success"
			},
			"form_element": {
				"error": "form_element_error",
				"clear": "form_element_clear"
			},
			"dispatcher": {
				'content.change': "page_content_change",
				'content.render.start': "page_content_render_start",
				'content.transition.out.complete': "page_content_transition_out_complete",
				'content.clear.start': "page_content_clear_start",
				'content.clear.complete': "page_content_clear_complete",
				'content.widget.preload.complete': "page_content_widget_preload_complete",
				'content.widget.load.start': "page_content_widget_load_start",
				'content.widget.load.complete': "page_content_widget_load_complete",
				'content.widget.postload.complete': "page_content_widget_postload.complete",
				'content.transition.in.complete': "page_content_transition_in_complete",
				'content.render.complete': "page_content_render_complete"
			},
			"error": {
				"http": "error_http"
			},
			"list": {
				"criteria.changed": "list_criteria_changed",
				"render.complete": 'list_render_complete'
			},
			"access_control": {
				"changed": "access_level_changed"
			}
		};
		return map;
	});
}(jQuery, cjaf));