/**
 * This is an abstract menu class the handles the abstraction of a menu
 * structure.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/helper/menu/renderer', [
		'cjaf/widget/helper/menu',
		'cjaf/widget/helper/menu/item'
	],
	/**
	 * @param {cjaf.Widget.Helper.Menu} Menu
	 * @param {cjaf.Widget.Helper.Menu.Item} MenuItem
	 * @return {cjaf.Widget.Helper.Menu.Renderer}
	 */
	function (Menu, MenuItem) {
		var Renderer	= cjaf.namespace("Widget.Helper.Menu.Renderer", function () {
			/**
			 * This is the template that will be used to create the menu markup.
			 * @type {string}
			 */
			this.menuTemplate	= null;
			/**
			 * This is the template that will be used to create the menu item
			 * mark up.
			 * @type {string}
			 */
			this.menuItemTemplate	= null;
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
			this.container_class	= 'ui-widget';
			/**
			 * This is the CSS class that will be applied to the menu.
			 * @type {string}
			 */
			this.menu_class			= 'ui-widget-content ui-menu';
			/**
			 * This is the CSS class that will be applied to the menu items.
			 * @type {string}
			 */
			this.menu_item_class	= 'ui-menu-item';

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
				return  $(cjaf.view(this.menuTemplate, menu))
					.addClass(this.menu_class)
					.attr('id', menu.getId());
			},
			/**
			 * This function will render a given menu item.  Menu items will be
			 * placed into the menu in the order which they are given.
			 * @param {MenuItem} menu_item
			 * @return {jQuery}
			 */
			"renderMenuItem": function (menu_item) {
				var title	= menu_item.getTitle(),
				ref			= menu_item.getRef(), item;

				if (!title) {
					title	= menu_item.getId();
				}
				if (!ref) {
					ref		= '#';
				}
				
				item	= {
					"text": title,
					"ref": ref
				};
				
				return $(cjaf.view(this.menuItemTemplate, item)).addClass(this.menu_class);
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
			"setMenuItem": function (css_class, clear_default) {
				if (clear_default) {
					this.menu_item_class	= css_class;
				} else {
					this.menu_item_class	+= ' ' + css_class;
				}
				return this;
			},
			/**
			 * Render the menu structure and return it.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"render": function (menu) {
				var menu_html	= this.renderMenu(menu),
				menu_item_list	= menu.getItems(),
				menu_item, container;
				
				while (menu_item_list.hasNext()) {
					menu_item	= menu_item_list.getNext();
					this.menuItemCallback(
						this.renderMenuItem(menu_item).appendTo(menu_html), menu_item
					);
				}
				
				this.postRenderHook(container, menu_html, menu);
				this.menuCompleteCallback(container, menu);
				
				return container;
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