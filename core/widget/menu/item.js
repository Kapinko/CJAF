/**
 * This is a generic menu item widget.
 */
/*jslint nomen: false, strict: false*/
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/menu/item', [
		'cjaf/widget/helper/event',
		'cjaf/widget/helper/menu/item'
	],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 * @param {cjaf.Widget.Helper.Menu.Item} MenuItem
	 */
	function (EventHelper, MenuItem) {
		$.widget('cjaf.menu_item', {
			/**
			 * These are the available options for this widget and their
			 * default values.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This is a menu item object that this widget will use to control
				 * the attached element.
				 * @type {MenuItem}
				 */
				"menu_item": null,
				/**
				 * This is the CSS class that will be applied to this item when
				 * it is the currently selected item.
				 * @type {string}
				 */
				"selected_class": 'selected',
				/**
				 * This is a list of the menu items that are sub-items of our
				 * item.  We should only display ourselves as selected when the
				 * user has chosen one of the sub items.
				 * @type {Array.<string>}
				 */
				"sub_items": []
			},
			/**
			 * The initialization method for this widget.
			 */
			_create: function () {
				var el	= this.element;
				page_change_handler	= $.proxy(this, "_handleItemSelect"),
				sub_items			= this.options.sub_items,
				sub_menu_items		= this.options.menu_item.getItems();
				
				if (!this._isAllowed()) {
					el.css('display', 'none');
				}
				
				while (sub_menu_items.hasNext()) {
					sub_items.push(sub_menu_items.getNext().getRef());
				}
				
				//Listen for an access control environment change.
				$(document).bind(EventHelper.access_control.changed, $.proxy(this, "_handleAccessControlChange"));
				
				//Listen for a page change event where someone is targeting us.
				el.bind(EventHelper.menu.item.select, $.proxy(this, "_handleItemSelect"));
			},
			/**
			 * Handle the user selection of an item in this menu.
			 * @param {jQuery.Event} event
			 * @param {Object.<string,string>} item
			 * @return {boolean}
			 */
			"_handleItemSelect": function (event, item){
				var menu_item	= this.options.menu_item,
				selected		= this.options.selected_class,
				sub_items		= this.options.sub_items,
				el				= this.element;
				
				//@todo add in a check to see if a "sub item" is the current item.
				if (item.id === menu_item.getId() || $.inArray(item.id, sub_items) > 0) {
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
			"_handleAccessControlChange": function () {
				var display	= '';
				
				if (!this._isAllowed()) {
					display	= 'none';
				}
				this.element.css('display', display);
			},
			/**
			 * Is the suer allowed to access this menu item?
			 * @return {boolean}
			 */
			_isAllowed: function () {
				return this.options.menu_item.isAllowed();
			}
		});
	});
}(jQuery, cjaf));