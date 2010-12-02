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
		/**
		 * An abstract menu renderer.
		 * @constructor
		 */
		Menu.Renderer	= function () {
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
		};
		Menu.Renderer.prototype	= {
			/**
			 * this is a constructor hook.
			 */
			"init": function () {},
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
			 * Set the CSS class for the container
			 * @param {string} css_class
			 * @param {boolean} clear_default
			 * @return {Menu.Renderer}
			 */
			"setContainerClass": function (css_class, clear_default) {
				if (clear_default) {
					this.container_class	= css_class;
				} else {
					this.container_class	+= ' ' + css_class;
				}
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
			"render": function(menu) {
				var menu_html	= this.renderMenu(menu),
				menu_item_list	= menu.getItems(),
				menu_item, container;
				
				while (menu_item_list.hasNext()) {
					menu_item	= menu_item_list.getNext();
					this.menuItemCallback(
						this.renderMenuItem(menu_item).appendTo(menu_html), menu_item
					);
				}

				container	= this.renderContainer(menu);
				menu_html.appendTo(container);
				this.menuCompleteCallback(container, menu);
				
				return container;
			},
			/**
			 * This function will render the menu container.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"renderContainer": function (menu) {
				return $('<div>').addClass(this.container_class).attr('id', 'container-' + menu.getId());
			},
			/**
			 * This function will render the menu itself.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"renderMenu": function (menu) {
				var ul	= $('<ul>');
				ul.addClass(this.menu_class)
					.attr('id', menu.getId());
				return ul;
			},
			/**
			 * This function will render a given menu item.  Menu items will be
			 * placed into the menu in the order which they are given.
			 * @param {MenuItem} menu_item
			 * @return {jQuery}
			 */
			"renderMenuItem": function (menu_item) {
				var title	= menu_item.getTitle(),
				ref			= menu_item.getRef(), li;

				if (!title) {
					title	= menu_item.getId();
				}
				
				li	= $('<li>').addClass(this.menu_item_class)
					.attr('id', menu_item.getId())
					.click(menu_item.getAction());

				if(ref) {
					li.html('<a href="#' + ref + '">' + title + '</a>');
				} else {
					li.text(title);
				}
				return li;
			}
		};
		return Menu.Renderer;
	});
}(jQuery, cjaf));