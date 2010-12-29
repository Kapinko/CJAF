/**
 * This is a base class for navigation widgets.
 */
/** JSLint declarations*/
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/
(function ($, cjaf) {
    cjaf.define('core/widget/navigation', [
		'cjaf/widget/helper/event',
		'core/widget/helper/menu/renderer',
		'core/widget/helper/menu',
		'core/widget/helper/menu/item',
		'core/widget/navigation/item',
		'core/widget/menu'
    ],
    /**
     * @param {cjaf.Widget.Helper.Event} EventHelper
     * @param {cjaf.Widget.Helper.Menu.Renderer} Renderer
     * @param {cjaf.Widget.Helper.Menu} Menu
     * @param {cjaf.Widget.Helper.Menu.Item} MenuItem
     */
    function (EventHelper, Renderer, Menu, MenuItem) {
		$.widget('cjaf.core_navigation', $.cjaf.core_menu, {
			/**
			 * These are the available options for this widget and
			 * their associated defaults.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This is the list of pages that will be included in the 
				 * navigation menu.  You should provide the page url key (minus
				 * the hash (#)) and then you can optionally provide a 
				 * "locale_key" which is what will be used to retrieve the
				 * link's name from the locale object; by default the page key
				 * will be used. Also, you can provide an "isAllowed" function
				 * if this function returns true then the option will be shown,
				 * if not, then the option will be hidden.
				 * @type {Object.<string, Object>}
				 */
				"pageList": {
					'home': {
						'localeKey': 'index',
						'isAllowed': function () {
							return true;
						},
						'subPages': {}
					}
				},
				/**
				 * This is the class that will be applied to the menu
				 * container.
				 * @type {string}
				 */
				"menuContainerClass": 'cjaf-navigation',
				/**
				 *This is the class that should be applied to a navigation item
				 *to denote that it is the currently selected option.
				 * @type {string}
				 */
				"selectedClass": 'current-page'
			},
			/**
			 * This is the initialization function for this widget.
			 */
			_create: function () {
				var o	= this.options;
				o.menu	= this._getMenuFromPageList(o.pageList);
				
				$.cjaf.core_menu.prototype._create.apply(this, arguments);
			},
			/**
			 * Set the current page for this menu.
			 * @param {Object} page
			 * @return {jQuery}
			 */
			"setPage": function (page) {
				this.setCurrent(page);
			},
			/**
			 * Get a menu object from the given page list.
			 * @param {Object.<string,*>} page_list
			 * @return {cjaf.Widget.Helper.Menu}
			 */
			_getMenuFromPageList: function (page_list) {
				var menu, menu_item, page, page_opts, locale_key, action,
				locale	= this.options.locale.links;
		
				menu	= new Menu();
		
				for (page in page_list) {
					if (page_list.hasOwnProperty(page)) {
						page_opts	= page_list[page];
						
						menu_item	= this._getMenuItemFromPageObject(page, page_opts, locale);
						menu.addItem(menu_item);
					}
				}
		
				return menu;
			},
			
			/**
			 * Create a menu item from the given page object.
			 * @param {string} name - the name of this page
			 * @param {Object.<string,*>} page - the object that represents this page.
			 * @param {Object.<string,*>} locale - the locale object to use for this menu item.
			 */
			 _getMenuItemFromPageObject: function (name, page, locale) {
			 	var locale_key	= page.hasOwnProperty('localeKey') ? page.localeKey : name,
			 	menu_item		= new MenuItem(),
			 	sub_menu_items;
			 	
			 	menu_item.setTitle(locale[locale_key])
			 			.setRef(name);
			 			
			 	if (page.hasOwnProperty('isAllowed')) {
			 		menu_item.setAuthFunction(page.isAllowed);
			 	}
			 	if (page.hasOwnProperty('image')) {
			 		menu_item.setImageUrl(page.image);
			 	}
			 	
			 	if (page.hasOwnProperty('subPages')) {
			 		sub_menu_items	= this._getMenuFromPageList(page.subPages).getItems();
			 		
			 		while (sub_menu_items.hasNext()) {
			 			menu_item.addItem(sub_menu_items.getNext());
			 		}
			 	}
			 	
			 	return menu_item;
			 }
		});
    });
}(jQuery, cjaf));