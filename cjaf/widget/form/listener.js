/**
 * This is a base class for a widget that listens for and handles form events.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define("cjaf/widget/form/listener", [
		'cjaf/widget/form/helper/event'
	],
	/**
	 * @param {cjaf.Widget.Form.Helper.Event} EventHelper
	 */
	function (EventHelper) {
		/**
		 * This is a list of form events and their associated handlers.
		 * @type {Array.<Object>}
		 */
		var events	= [
			{name: EventHelper.load.initialized, handler: 'handleFormLoadInitialize'},
			{name: EventHelper.load.complete, handler: 'handleFormLoadComplete'},
			{name: EventHelper.submit.client, handler: 'handleFormSubmitClient'},
			{name: EventHelper.submit.server, handler: 'handleFormSubmitServer'},
			{name: EventHelper.error, handler: 'handleFormError'},
			{name: EventHelper.success, handler: 'handleFormSuccess'},
			{name: EventHelper.clear, handler: 'handleFormClear'},
			{name: EventHelper.validation.failed, handler: 'handleFormValidationFailed'},
			{name: EventHelper.validation.success, handler: 'handleFormValidationSuccess'}
		];
		
		$.widget('cjaf.form_listener', {
			/**
			 * These are the available options for this widget.
			 * @type {Object.<string, *>}
			 */
			options: {
				"form": null
			},
			/**
			 * Initialize this listener widget
			 */
			"_create": function () {
				var self	= this,
				forms		= $(this.options.form).filter('form'),
				bind_event, x;
				
				if (!forms.hasOwnProperty('length') || forms.length < 1) {
					throw "You must provide one or more JQuery forms in the \"form\" option.";
				}
				
				bind_event	= function (event_name, handler) {
					forms.bind(event_name, function () {
						self[handler].apply(self, arguments);
					});
				};
				for (x in events) {
					if (events.hasOwnProperty(x)) {
						bindEvent(events[x].name, events[x].handler);
					}
				}
				
			},
			/**
			 * Function to react to the form.load.initialize.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormLoadInitialize: function (event) {},
			/**
			 * Function to react to the form.load.complete.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormLoadComplete: function (event) {},
			/**
			 * Function to react to the form.submit.client.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormSubmitClient: function (event) {},
			/**
			 * Function to react to the form.submit.server.<formId> event.
			 * @todo rename method to "handleFormSubmitClient"
			 *
			 * @param {Object} event - event string
			 */
			handleFormSubmitServer: function (event) {},
			/**
			 * Function to react to the form.error.<formId> event.
			 *
			 * @param {jQuery.Event} event
			 * @param {string} message
			 * @return {boolean}
			 */
			handleFormError: function (event, message) {},
			/**
			 * Function to react to the form.success.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormSuccess: function (event) {},
			/**
			 * Function to react to the form.clear.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormClear: function (event) {},
			/**
			 * Function to react to the form.validation.failed.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormValidationFailed: function (event) {},
			/**
			 * Function to react to the form.validation.success.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			handleFormValidationSuccess: function (event) {}
		});
	});
}(jQuery, cjaf));