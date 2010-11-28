/**
 * This is a base class for navigation item widgets.
 */
/** JSLint declarations*/
/*global jQuery: false, cjaf: false, document:false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/navigation/item', [
		'lib/event/factory'
	],
	/**
	 * @param {EventFactory} EventFactory
	 */
	function (EventFactory) {
		$.widget('cjaf.navigation_item', {
			/**
			 * These are the available options for this widget.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This function is run on initialization and whenever there is
				 * an "auth change" event.  It must return true whenever the 
				 * user is allowed to access this navigation item; and return
				 * false when the user is blocked from accessing this item.
				 * @type {function():boolean}
				 */
				"isAllowed": function () {
					return true;
				},
				/**
				 * This is the "page key" for this navigation item.
				 * @type {string}
				 */
				"pageKey": null,
				/**
				 * This is the name for this navigation item.  It is what will 
				 * be displayed on the screen.
				 * @type {string}
				 */
				"pageName": null,
				/**
				 * This is the template that will be used to create this 
				 * navigation item.
				 * @type {string}
				 */
				"viewTemplate": null,
				/**
				 * This is the CSS class that will be added to this item's 
				 * element to denote that it is a navigation item.
				 * @type {string}
				 */
				"navClass": 'nav-item',
				/**
				 * This is the CSS class that will be applied to this item when 
				 * it is the currently selected item.
				 * @type {string}
				 */
				"selectedClass": 'selected',
				/**
				 * This is a list of pages that are sub-pages of the page that
				 * we're linked to.  We should only display ourselves as
				 * selected when the user is on one of the pages.
				 * @tyep {Array.<string>}
				 */
				"subPages": []
			},
			/**
			 * Initialize this navigation item.
			 */
			_create: function () {
				var o	= this.options,
				el		= this.element,
				self	= this;
				
				el.addClass(o.navClass);
				el.html(
					cjaf.view(o.viewTemplate, {
						"page_key": o.pageKey,
						"page_name": o.pageName
					})
				);
				if (!this._isAllowed()) {
					el.css('display', 'none');
				}
				
				EventFactory.bindToElement($(document), 'access_control', 'changed', function () {
					self._handleAccessControlChange.apply(self, arguments);
				});
				
				//Listen for a page event where someone is targeting us.
				EventFactory.bindToElement(el, 'dispatcher', 'content.change', function (event, page) {
					self._handlePageChange.apply(self, arguments);
					if (event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelable	= true;
					}
					return false; //stop the event bubble process.
				});
				
				//Listen for a page event on the document, ie from the dispatcher.
				EventFactory.bindToElement($(document), 'dispatcher', 'content.render.complete', function (event, page) {
					self._handlePageChange.apply(self, arguments);
				});
			},
			/**
			 * Handle the page being changed.
			 * @param {jQuery.Event} event
			 * @param {Object.<string,string>} page
			 * @return {boolean}
			 */
			_handlePageChange: function (event, page) {
				var o		= this.options,
				el			= this.element,
				selected	= this.options.selectedClass;
				
				if (page.id === o.pageKey || $.inArray(page.id, o.subPages) >= 0) {
					el.addClass(selected);
				} else {
					el.removeClass(selected);
				}
				return false;
			},
			/**
			 * Handle a user action that causes the user's site access to change.
			 */
			_handleAccessControlChange: function () {
				var display	= '';
				
				if (!this._isAllowed()) {
					display	= 'none';
				}
				this.element.css('display', display);
			},
			/**
			 * Is the user allowed to access this navigation item?
			 * @return {boolean}
			 */
			_isAllowed: function () {
				var is_allowed	= true;
				
				if (typeof this.options.isAllowed === 'function' && !this.options.isAllowed()) {
					is_allowed	= false;
				}
				return is_allowed;
			}
		});
	});
}(jQuery, cjaf));

