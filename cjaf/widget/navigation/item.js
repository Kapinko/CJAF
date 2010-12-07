/**
 * This is a base class for navigation item widgets.
 */
/** JSLint declarations*/
/*global jQuery: false, cjaf: false, window:false*/
/*jslint nomen:false*/

(function ($, cjaf, document) {
	cjaf.define('cjaf/widget/navigation/item', [
		'cjaf/widget/helper/menu/item',
		'cjaf/widget/helper/event'
	],
	/**
	 * @param {cjaf.Widget.Helper.Menu.Item} MenuItem
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 */
	function (MenuItem, EventHelper) {
		$.widget('cjaf.navigation_item', {
			/**
			 * These are the available options for this widget.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This is a menu item object that this widget will use to
				 * control the attached element.
				 * @type {MenuItem}
				 */
				"menuItem": null,
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
				var el				= this.element,
				page_change_handler	= $.proxy(this, "_handlePageChange"),
				sub_pages			= this.options.subPages,
				sub_menu_items		= this.options.menuItem.getItems();
				
				if (!this._isAllowed()) {
					el.css('display', 'none');
				}

				while (sub_menu_items.hasNext()) {
					sub_pages.push(sub_menu_items.getNext().getRef());
				}

				//Listen for an access control environment change.
				$(document).bind(EventHelper.access_control.changed, $.proxy(this, "_handleAccessControlChange"));

				//Listen for a page event where someone is targeting us.
				el.bind(EventHelper.dispatcher.content.change, page_change_handler);
			},
			/**
			 * Handle the page being changed.
			 * @param {jQuery.Event} event
			 * @param {Object.<string,string>} page
			 * @return {boolean}
			 */
			_handlePageChange: function (event, page) {
				var menu_item	= this.options.menuItem,
				selected		= this.options.selectedClass,
				sub_pages		= this.options.subPages,
				el				= this.element;

				//@todo add in a check to see if a "sub page" is the current page.
				if (page.id === menu_item.getRef() || $.inArray(page.id, sub_pages) > 0) {
					el.addClass(selected);
				} else {
					el.removeClass(selected);
				}

				if (event.target !== document) {
					//stop the event bubble process
					if (event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelable	= true;
					}
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
				return this.options.menuItem.isAllowed();
			}
		});
	});
}(jQuery, cjaf, window.document));

