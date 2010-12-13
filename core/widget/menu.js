/**
 * This is a generic menu widget.
 */
/*jslint nomen: false, strict: false */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('core/widget/menu', [
		'cjaf/widget/helper/event',
		'core/widget/helper/menu',
		'core/widget/helper/menu/item',
		'core/widget/helper/menu/renderer',
		'core/widget/menu/item'
	],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 * @param {cjaf.Widget.Helper.Menu} Menu
	 * @param {cjaf.Widget.Helper.Menu.Item} MenuItem
	 * @param {cjaf.Widget.Helper.Menu.Renderer} Renderer
	 */
	function (EventHelper, Menu, MenuItem, Renderer) {
	    $.widget('cjaf.core_menu', {
			/**
			 * These are the available options for this widget and their
			 * associated defaults.
			 * @type {Object.<string,*>}
			 */
			options: {
			   /**
				* This is the locale object that will be passed to the
				* initialization view template for this widget.
				* @type {Object.<string,*>}
				*/
			    "locale": null,
			   /**
				* This is the CSS class that should be applied to the menu
				* item to denote that it is the currently selected option.
				* @type {string}
				*/
			    "selected_class": "current-item",
			   /**
				* This is the CSS class that will be applied to the menu
				* container.
				* @type {string}
				*/
			    "menuContainerClass": "cjaf-menu",
			   /**
				* This is the selector to use to find the menu item elements
				* within this menu.
				* @type {string}
				*/
			    "menuItemSelector": "li",
			   /**
				* This is an object that represents the menu we should be
				* rendering.
				* @type {Menu}
				*/
			    "menu": null,
			   /**
				* This is the renderer object that will be used to render this
				* menu.
				* @type {Renderer}
				*/
			    "renderer": Renderer,
			   /**
				* This function will be passed the menu containing element that
				* is currently hidden. It is expected that this function will
				* show (un-hide) the menu.
				* @param {jQuery} el
				* @return {jQuery}
				*/
			    "show": function (el) {
					return el.slideDown();
			    },
				/**
				 * This is the anme of the navigation item widget we're going
				 * to use to control the individual menu items.
				 * @type {string}
				 */
				"itemWidget": "core_menu_item"
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
				if (!(this.options.menu instanceof Menu)) {
					throw "You must provide a menu object representing the menu to render.";
				}
				var el			= this.element,
					o			= this.options,
					renderer	= new o.renderer();
					
				el.hide();
				
				el.addClass(o.menuContainerClass);
				
				renderer.setMenuItemCallback($.proxy(this, "_initMenuItem"))
					.setMenuCompleteCallback($.proxy(this, "_menuRenderComplete"))
					.render(o.menu);
						
				this.initialized	= true;
			},
			/**
			 * Set the current item for this menu.
			 * @param {Object} item
			 * @return {jQuery}
			 */
			"setCurrent": function (item) {
				var items	= this.getItems();
				items.each(function () {
					$(this).trigger(EventHelper.dispatcher.content.change, [item]);
				});
				return this.element;
			},
			/**
			 * The the menu item elements.
			 * @return {jQuery}
			 */
			"getItems": function () {
				var o	= this.options;
				return this.element.find('.' + o.menuContainerClass).find(o.menuItemSelector);
			},
			/**
			 * This function is called when the menu rendering is complete.
			 * @param {jQuery} container
			 * @param {cjaf.Widget.Helper.Menu} menu
			 * @return {boolean}
			 */
			"_menuRenderComplete": function (container, menu) {
				var o	= this.options,
				el		= this.element;
				
				el.html(container);
				
				if (o.current && o.current.id) {
					this.setCurrent(o.current);
				}
				
				o.show(el);
				return false;
			},
			/**
			 * This function is called when an menu item has been rendered.
			 * @param {jQuery} el
			 * @param {cjaf.Widget.Helper.Menu.Item} menu_item
			 * @return {boolean}
			 */
			"_initMenuItem": function (el, menu_item) {
				var item_widget	= this.options.itemWidget;
				
				if (!el[item_widget] || typeof el[item_widget] !== 'function') {
					throw "Item widget option does not represent a valid jQueryUI widget.";
				}
				el[item_widget]({
					"menu_item": menu_item,
					"selected_class": this.options.selected_class
				});
				return false;
			}
	    });
	});
}(jQuery, cjaf));