/**
 * This is a dispatcher plugin to load widgets that will stay on the page
 * even when the content.change event occurs.  This can be used to load things
 * like a navigation bar widget.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/dispatcher/plugin/widget_loader', [
		'cjaf/widget/dispatcher/plugin'
	],
	/**
	 * @param {DispatcherPlugin} DispatcherPlugin
	 * @return {$.cjaf.Dispatcher.Plugin.WidgetLoader}
	 */
	function (DispatcherPlugin) {
		var WidgetLoader	= DispatcherPlugin.extend({
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
			init: function (element, widget_name, widget_options) {
				if (typeof element[widget_name] === 'function') {
					//Add the widget pre-load method.
					/**
					 * @param {cjaf.Dispatcher} dispatcher
					 * @param {jQuery} content_area
					 * @param {Object} current_page
					 * @param {Object} target_page
					 * @return {boolean}
					 */
					this.preWidgetLoad	= function (dispatcher, content_area, current_page, target_page) {
						if (!this.initialized) {
							this._initializeWidget(element, widget_name, widget_options, target_page);
						} else {
							this._notifyWidgetOfPageChange(element, widget_name, target_page);
						}
					};
				}
			},
			/**
			 * Initialize and attach the widget.
			 * 
			 * @param {jQuery} target_element
			 * @param {string} widget_name
			 * @param {Object.<string,*>} widget_options
			 * @param {Object} page
			 */
			_initializeWidget: function (target_element, widget_name, widget_options, page) {
				var settings = $.extend({}, widget_options, {"page": page});
				
				target_element[widget_name](settings);
				this.initialized	= true;
			},
			/**
			 * Notify the widget of a page change.
			 * 
			 * @param {jQuery} target_element
			 * @param {string} widget_name
			 * @param {Object} page
			 */
			_notifyWidgetOfPageChange: function (target_element, widget_name, page) {
				target_element[widget_name]('setPage', page);
			}
		});
		
		$.cjaf.Dispatcher.Plugin.WidgetLoader	= WidgetLoader;
		return $.cjaf.Dispatcher.Plugin.WidgetLoader;
	});
}(jQuery, cjaf));