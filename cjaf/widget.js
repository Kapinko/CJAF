/**
 * This is the place where all necessary customizations to the jQueryUI widget
 * framework are made
 */
/*jslint nomen: false*/
/*global jQuery: false, cjaf: false*/


(function ($, cjaf) {
	cjaf.define('cjaf/widget', [],
	function () {
		/**
		 * Obtain a rendered view for this widget.
		 * @param {string} view
		 * @param {*} data
		 */
		$.Widget.prototype._view	= function (view, data) {
			var options;
			
			if (this.options.initView) {
				options	= this.options.initView;
				
			} else {
				if (typeof view !== 'string') {
					data	= view;
					view	= cjaf.View.getDefault();
				}
				options	= {
					"name": this.widgetName.split('_').join('/'),
					"view": view
				};
			}

			return cjaf.view(options, data);
		};
	});
}(jQuery, cjaf));