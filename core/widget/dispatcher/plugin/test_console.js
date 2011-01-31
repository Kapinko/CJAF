/**
 * This is a dispatcher plugin to load widgets that will stay on the page
 * even when the content.change event occurs.  This can be used to load things
 * like a navigation bar widget.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('core/widget/dispatcher/plugin/test_console', [
		'cjaf/class',
		'cjaf/widget/dispatcher/plugin',
		'core/widget/console/test'
	],
	/**
	 * @param {$.cjaf.Class} Class
	 * @param {DispatcherPlugin} DispatcherPlugin
	 * @return {$.cjaf.Dispatcher.Plugin.WidgetLoader}
	 */
	function (Class, DispatcherPlugin) {
		var WidgetLoader	= cjaf.namespace("Dispatcher.Plugin.TestConsole",
		Class.extend(DispatcherPlugin, {
			/**
			 * Has this widget already been loaded?
			 * @type {boolean}
			 */
			initialized: false,
			/**
			 * Dispatcher Plugin to load a static widget.
			 * @param {jQuery} element
			 * @param {string} widget_name
			 * @param {Object.<string,*>} widget_options
			 */
			init: function () {
				//Add the widget pre-load method.
				/**
				 * @param {cjaf.Dispatcher} dispatcher
				 * @param {jQuery} content_area
				 * @param {Object} current_page
				 * @param {Object} target_page
				 * @return {boolean}
				 */
				this.preWidgetLoad	= function (dispatcher, content_area, current_page, target_page) {
					if(!this.initialized){
						this._initializeConsole();
					}
					return true;
				};
			},
			/**
			 * Set up the user information bar widget.
			 */
			_initializeConsole: function(){
				var div = $(document.createElement('div'));
				div.attr('id', 'test-console');
				$('body').append(div);

				$('#test-console').core_console_test();
				this._bindToBackWhackEvent();
				this.initialized	= true;
			},
			_bindToBackWhackEvent: function(){
				$(document).keydown(function(ev) {
					if (ev.keyCode == 220) { //user pressed back slash on the document
						$('#test-console').core_console_test('toggle');
					}
				});
			}
		}));
		return WidgetLoader;
	});
}(jQuery, cjaf));