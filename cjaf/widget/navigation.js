/**
 * This is a base class for navigation widgets.
 */
/** JSLint declarations*/
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/navigation', [
		'cjaf/widget/helper/menu/renderer',
		'cjaf/widget/helper/menu',
		'cjaf/widget/helper/menu/item',
		'cjaf/widget/helper/event',
		'cjaf/widget/navigation/item'
	],
	/**
	 * @param {cjaf.Widget.Helper.Menu.Renderer} Renderer
	 * @param {cjaf.Widget.Helper.Menu} Menu
	 * @param {cjaf.Widget.Helper.Menu.Item} MenuItem
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 */
	function (Renderer, Menu, MenuItem, EventHelper) {
		$.widget('cjaf.navigation', {
			/**
			 * These are the available options for this widget and
			 * their associated defaults.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This is the full path to the initialization view for this
				 * widget.  In this base class it is not set because it is
				 * assumed that the user will want to provide their own.
				 * @type {string}
				 */
				"initViewPath": null,
				/**
				 * This is the locale object that will be passed to the
				 * initialization view template for this widget.
				 * @type {Object.<string,*>}
				 */
				"locale": {},
				/**
				 * This is the jQuery object that will be used as a template 
				 * for the individual navigation items.
				 * @type {jQuery}
				 */
				"itemTemplate": $('<li></li>'),
				/**
				 * This is the view template that will be used to create
				 * each navigation item.
				 * @type {string}
				 */
				"itemViewTemplate": null,
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
						'subPages': []
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
				"selectedClass": 'current-page',
				/**
				 * This is the renderer that we will use to render this menu.
				 * @type {cjaf.Widget.Helper.Menu.Renderer}
				 */
				"renderer": Renderer
			},
			/**
			 * Has this menu been initialized?
			 * @type {boolean}
			 */
			initialized: false,
			/**
			 * This is the initialization function for this widget.
			 */
			_create: function () {
				var o	= this.options,
				renderer	= new (o.renderer)(),
				menu		= this._getMenuFromPageList(o.pageList);
				
				this.element.hide();
				
				renderer.setMenuItemCallback($.proxy(this, "_initMenuItem"))
						.setMenuCompleteCallback($.proxy(this, "_menuRenderComplete"))
						.setContainerClass(o.menuContainerClass)
						.render(menu);
				
				this.initialized	= true;
			},
			/**
			 * Set the current page for this menu.
			 * @param {Object} page
			 * @return {jQuery}
			 */
			"setPage": function (page) {
				var items	= this.getItems();
				items.each(function () {
					$(this).trigger(EventHelper.dispatcher.content.change, [page]);
				});
				return this.element;
			},
			/*
			 * Get the navigation url links
			 * @return {jQuery}
			 */
			"getItems": function () {
				return this.element.find('.'+this.options.menuContainerClass).find('li');
			},
			/**
			 * This function is called when the menu rendering is complete.
			 * @param {jQuery} container
			 * @param {cjaf.Widget.Helper.Menu} menu
			 * @return {boolean}
			 */
			"_menuRenderComplete": function (container, menu) {
				var o	= this.options,
					el	= this.element;

				el.html(container);
				
				if (o.page.hasOwnProperty('id') && o.page.id) {
					this.setPage(o.page);
				}
				
				el.slideDown();
				return false;
			},
			/**
			 * This function is called when a menu item has been rendered.
			 * @param {jQuery} el
			 * @param {cjaf.Widget.Helper.Menu.Item} menu_item
			 * @return {boolean}
			 */
			"_initMenuItem": function (el, menu_item) {
				el.navigation_item({
					"menuItem": menu_item,
					"selectedClass": this.options.selectedClass
				});
				return false;
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
						locale_key	= page_opts.hasOwnProperty('localeKey') ? page_opts.localeKey : page;

						menu_item	= new MenuItem();
						menu_item.setTitle(locale[locale_key])
								.setRef(page);

						if (page_opts.hasOwnProperty('isAllowed')) {
							menu_item.setAuthFunction(page_opts.isAllowed);
						}
						if (page_opts.hasOwnProperty('subPages')) {
							//@todo Add sub pages here.
						}
						menu.addItem(menu_item);
					}
				}

				return menu;
			}
		});
	});
}(jQuery, cjaf));