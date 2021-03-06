/**
 * This is an abstract menu class the handles the abstraction of a menu
 * structure.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('core/widget/helper/menu/renderer', [
		'core/widget/helper/menu',
		'core/widget/helper/menu/item'
	],
	/**
	 * @param {cjaf.Core.Widget.Helper.Menu} Menu
	 * @param {cjaf.Core.Widget.Helper.Menu.Item} MenuItem
	 * @return {cjaf.Core.Widget.Helper.Menu.Renderer}
	 */
	function (Menu, MenuItem) {
		var Renderer	= cjaf.namespace("Core.Widget.Helper.Menu.Renderer", function () {
			/**
			 * This is a callback that will be called when we have rendered
			 * a menu item and that menu item will be passed as a jQuery object.
			 * @type {function(jQuery):boolean}
			 */
			this.menuItemCallback	= $.noop;

			/**
			 * This is a callback that will be called when we have rendered the
			 * menu in its entirety.
			 * @type {function(jQuery):boolean}
			 */
			this.menuCompleteCallback	= $.noop;

			/**
			 * This is the CSS class that will be applied to the menu container.
			 * @type {string}
			 */
			this.container_class	= '';
			/**
			 * This is the CSS class that will be applied to the menu.
			 * @type {string}
			 */
			this.menu_class			= '';
			/**
			 * This is the CSS class that will be applied to the menu items.
			 * @type {string}
			 */
			this.menu_item_class	= '';
			/**
			 * This is the CSS class that will be applied to the menu item
			 * when it is the first item in the menu.
			 * @type {string}
			 */
			this.menu_item_first_class	= 'first';
			/**
			 * This is the CSS class that will be applied to the menu item
			 * when it is the last item in the menu.
			 * @type {string}
			 */
			this.menu_item_last_class	= 'last';
			/**
			 * This is the CSS class that will be applied to the menu item
			 * links.
			 * @type {string}
			 */
			this.menu_item_link_class	= "";
			/**
			 * This is the structure that will be used as the menu structure
			 * element. This will be cloned.
			 * @type {jQuery}
			 */
			this.menu_element	= $('<ul>');
			/**
			 * This is the structure taht will be used as the menu item structure
			 * element. This will be cloned.
			 * @type {jQuery}
			 */
			this.menu_item_element	= $('<li>');

			this.init();
		});
		Renderer.prototype	= {
			/**
			 * this is a constructor hook.
			 */
			"init": function () {},
			/**
			 * This function will render the menu itself.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"renderMenu": function (menu) {
			    return this.menu_element.clone()
				.addClass(this.menu_class)
				.attr('id', menu.getId());
			},
			/**
			 * This function will render a given menu item.  Menu items will be
			 * placed into the menu in the order which they are given.
			 * @param {MenuItem} menu_item
			 * @param {boolean} is_first
			 * @param {boolean} is_last
			 * @return {jQuery}
			 */
			"renderMenuItem": function (menu_item, is_first, is_last) {
				var title	= menu_item.getTitle(),
				ref		= menu_item.getRef(), item, sub_items, sub_menu;

				if (!title) {
					title	= menu_item.getId();
				}
				if (!ref) {
					ref		= '#';
				}
				
				if (ref.indexOf('#') !== 0) {
					ref	= '#' + ref;
				}
				
				item	= this.menu_item_element.clone()
					.addClass(this.menu_item_class);
					
				if (is_first) {
					item.addClass(this.menu_item_first_class);
				} else if (is_last) {
					item.addClass(this.menu_item_last_class);
				}
					
				this.renderMenuItemLink(title, ref, title).appendTo(item);
				
				item	= this.renderSubMenu(item, menu_item);
				    
				return item;
			},
			/**
			 * This function will render the sub menu for the given menu item.
			 * @param {jQuery} item_html - the current menu HTML markup.
			 * @param {MenuItem} menu_item - the JavaScript representation of the menu item.
			 */
			"renderSubMenu": function (item_html, menu_item) {
				var sub_items	= menu_item.getItems(), sub_menu;
				
				if (sub_items.getCount() > 0) {
					sub_menu	= new Menu();
					
					while (sub_items.hasNext()) {
						sub_menu.addItem(sub_items.getNext());
					}
					
					this.render(sub_menu).appendTo(item_html);
				}
				
				return item_html;
			},
			/**
			 * Render the link for a menu item
			 * @param {text}
			 * @param {href}
			 * @return {jQuery}
			 */
			"renderMenuItemLink": function (text, href, title) {
				return $('<a>')
					.addClass(this.menu_item_link_class)
				    .attr('href', href)
				    .attr('title', title)
				    .html(text);
			},
			/**
			 * Render the menu structure and return it.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"render": function (menu) {
				this.preRenderHook(menu);
				
				var menu_html	= this.renderMenu(menu),
				menu_item_list	= menu.getItems(),
				first			= true,
				menu_item, item_html;
				
				while (menu_item_list.hasNext()) {
					menu_item	= menu_item_list.getNext();
                    item_html   = this.renderMenuItem(menu_item, first, !menu_item_list.hasNext());

                    item_html.appendTo(menu_html).click(menu_item.getAction());
                    
                    this.menuItemCallback(item_html, menu_item);
					
					first	= false;
				}
				
				this.postRenderHook(menu_html, menu);
				this.menuCompleteCallback(menu_html, menu);
				
				return menu_html;
			},
			/**
			 * Set the menu structure element.
			 * @param {jQuery} element
			 * @return {Menu.Renderer}
			 */
			"setMenuElement": function (element) {
				this.menu_element	= element;
				return this;
			},
			/**
			 * Set the menu item structure element.
			 * @param {jQuery} element
			 * @return {Menu.Renderer}
			 */
			"setMenuItemElement": function (element) {
				this.menu_item_element	= element;
				return this;
			},
			/**
			 * Set the menu complete callback
			 * @param {function(jQuery, cjaf.Widget.Helper.Menu):boolean} callback
			 * @return {Menu.Renderer}
			 */
			"setMenuCompleteCallback": function (callback) {
				this.menuCompleteCallback	= callback;
				return this;
			},
			/**
			 * Set the menu item callback.
			 * @param {function(jQuery, cjaf.Widget.Helper.Menu.Item):boolean} callback
			 * @return {Menu.Renderer}
			 */
			"setMenuItemCallback": function (callback) {
				this.menuItemCallback	= callback;
				return this;
			},
			/**
			 * Set the CSS class for the menu
			 * @param {string} css_class
			 * @param {boolean} clear_default
			 * @return {Menu.Renderer}
			 */
			"setMenuClass": function (css_class, clear_default) {
				if (clear_default) {
					this.menu_class	= css_class;
				} else {
					this.menu_class	+= ' ' + css_class;
				}
				return this;
			},
			/**
			 * Set the CSS class for the menu items
			 * @param {string} css_class
			 * @param {boolean} clear_default
			 * @return {Menu.Renderer}
			 */
			"setMenuItemClass": function (css_class, clear_default) {
				if (clear_default) {
					this.menu_item_class	= css_class;
				} else {
					this.menu_item_class	+= ' ' + css_class;
				}
				return this;
			},
			/**
			 * Set the CSS class for menu items that are the first displayed.
			 * @param {string} css_class
			 * @param {boolean} clear_default
			 * @return {Menu.Renderer}
			 */
			'setMenuItemFirstClass': function (css_class, clear_default) {
				if (clear_default) {
					this.menu_item_first_class	= css_class;
				} else {
					this.menu_item_first_class	+= ' ' + css_class;
				}
				return this;
			},
			/**
			 * Set the CSS class for menu items that are the last displayed.
			 * @param {string} css_class
			 * @param {boolean} clear_default
			 * @return {Menu.Renderer}
			 */
			'setMenuItemLastClass': function (css_class, clear_default) {
				if (clear_default) {
					this.menu_item_last_class	= css_class;
				} else {
					this.menu_item_last_class	+= ' ' + css_class;
				}
				return this;
			},
			/**
			 * Set the CSS class to the menu item links
			 * @param {string} css_class
			 * @param {boolean} clear_default
			 * @return {Menu.Renderer}
			 */
			"setMenuItemLinkClass": function (css_class, clear_default) {
				if (clear_default) {
					this.menu_item_link_class	= css_class;
				} else {
					this.menu_item_link_class	+= ' ' + css_class;
				}
				return this;
			},
			/**
			 * This is a hook so that child classes can to any necessary
			 * configuration before the menu has been created.
			 * @param {jQuery} container
			 * @param {Menu} menu
			 * @return {Renderer}
			 */
			"preRenderHook": function (container, menu) {
				return this;
			},
			/*
			 * This is a hook so that child classes can do any necessary 
			 * configuration after the menu has been created but before
			 * we pass the menu of to the user.
			 * @param {jQuery} container
			 * @param {jQuery} menu_html
			 * @param {Menu} menu
			 * @return {Renderer}
			 */
			"postRenderHook": function (container, menu_html, menu) {
				return this;
			}
		};
		return Renderer;
	});
}(jQuery, cjaf));