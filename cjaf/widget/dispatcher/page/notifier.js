/**
 * This is an object that notifies the dispatcher that the user has changed
 * a page. This default implementation uses the jQuery.bbq (back button query)
 * plugin.
 * @see http://benalman.com/projects/jquery-bbq-plugin/
 */
/*global jQuery: false, cjaf: false, window: false*/
(function ($, cjaf, window) {
	cjaf.define('cjaf/widget/dispatcher/page/notifier', [
		'cjaf/widget/helper/event',
		'cjaf/request',
		'lib/jquery/jquery.ba-bbq'
	],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 * @param {cjaf.Request} Request
	 * @return {cjaf.Dispatcher.Page.Notifier}
	 */
	function (EventHelper, Request) {
		/**
		 * Create the page change notification handler. The element provided
		 * must have a dispatcher attached for this object to function properly.
		 * You will not be warned about this but this will not work as expected.
		 * The change 
		 * @constructor
		 * @param {jQuery} dispatcher_el
		 * @param {string} change_event
		 *		
		 */
		var Notifier	= cjaf.namespace("Dispatcher.Page.Notifier", function (dispatcher_el, change_event) {
			/**
			 * This is a reference to the jQuery wrapped element that has the
			 * dispatcher attached. the "change_event" will be fired on this
			 * element whenever a hashchange event has been detected.
			 */
			this.dispatcher	= dispatcher_el;
			/**
			 * This is the type of event we will fire when we detect a page change.
			 * @type {string}
			 */
			this.change_event	= change_event ? change_event : EventHelper.dispatcher.content.change;
			
			this.init();
		});
		Notifier.prototype	= {
			/**
			 * Initialize this notifier.
			 */
			"init": function () {
				$(window).bind('hashchange', $.proxy(this, "handlePageChange"));
			},
			/**
			 * Override the default behavior of all <a> elements so that, when
			 * clicked, their `hre` value is pushed onto the history hash
			 * instead of being navigated to.
			 * @param {jQuery} base
			 * @return {boolean}
			 */
			"overridePageLinks": function (base) {
				var links	= (base) ? base.find('a') : $('a');
				links.click(function () {
					var href	= $(this).attr('href');
					$.bbq.pushState({url: href});
				});
				return false;
			},
			/**
			 * Get the page object represented by the current URL.
			 * @return {Object.<string,*>}
			 */
			"getCurrentPage": function () {
				var page			= {
					id: Request.getPage(),
					options: Request.getParams()
				};
				return page;
			},
			/**
			 * Handle the hashchange event.
			 * @param {jQuery.Event} event
			 */
			"handlePageChange": function (event) {
				var page	= this.getCurrentPage();
				
				if (page.id && page.id !== 'index') {
					this.dispatcher.trigger(this.change_event, [page]);
				} 
				return false;
			}
		};
		return Notifier;
	});
}(jQuery, cjaf, window));