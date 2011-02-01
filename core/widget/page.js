/**
 * This is an abstract page widget.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/page", [

	],
	function () {
		var counter	= 0;

		$.widget("cjaf.core_page", {
			options: {
				"pageName": "CJAF-PAGE-" + (counter += 1),
				"pageClass": "cjaf-widget page"
			},

			_create: function () {
				this.element.addClass(this.options.pageClass + " " + this.options.pageName);

				$.Widget.prototype._create.apply(this, arguments);
			},
			/**
			 *
			 */
			getName: function () {
				return this.options.pageName;
			}
		});
	});
}(jQuery, cjaf));