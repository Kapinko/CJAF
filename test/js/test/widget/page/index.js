/**
 * This is the page controller for the CJAF Test Framework index page.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('test/widget/page/index', [
		'cjaf/widget/helper/event',
		'cjaf/widget/dispatcher',
		'cjaf/widget/form',
		'test/widget/page/test'
	],
	function (EventHelper) {
		$.widget('cjaf.test_page_index', {
			/**
			 * These are the available options and their defaults for this
			 * widget.
			 * @type {Object.<string, *>}
			 */
			options: {
				
			},
			/**
			 * The initialization function for this widget.
			 */
			_create: function () {
				var o		= this.options,
					el		= this.element,
					content;

				el.html(this._view({}));
				content	= this.element.find('#content-section');

				el.dispatcher({
					defaultPage:	"test",
					pages:			{
						"test": "test_page_test"
					},
					"contentElement": content,//Antonio Banderas
					"transitionOut": function (element, callback) {
						element.effect("slide", {"direction": "right", "mode": "hide"}, 500, callback);
					},
					"transitionIn": function (element, callback) {
						element.effect("fade", {"mode": "show"}, 500, callback);
					}
				});
				el.dispatcher('render');

				el.find('.avmenu li a').click(function (event) {
					el.find('.avmenu li a').removeClass("current");
					$(event.currentTarget).addClass('current');
					el.trigger(EventHelper.dispatcher.content.change, [{id: 'test'}]);
					event.stopPropagation();
					event.preventDefault();
				});
			}
		});
	});
}(jQuery, cjaf));