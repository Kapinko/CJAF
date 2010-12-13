/**
 * This is an object that represents a menu, which is really just a collection
 * of menu items.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
"use strict";
(function ($, cjaf) {
	cjaf.define('cjaf/widget/helper/menu', [
		'cjaf/collection'
	], 
	/**
	 * @param {cjaf.Collection} Collection
	 * @return {cjaf.Widget.Helper.Menu}
	 */
	function (Collection) {
		var menu_counter	= 0,
		Menu	= cjaf.namespace("Widget.Helper.Menu", 
		/**
		 * An object to represent a menu (ie. a collection of menu items).
		 * @constructor
		 */
		function () {
			/**
			 * This is the identifier of this menu.
			 * @type {string}
			 */
			this.id	= 'CJAF-Menu-' + (menu_counter += 1);
			/**
			 * This is the title of this menu.
			 * @type {string}
			 */
			this.title	= null;
			/**
			 * This is the collection of menu items in this menu.
			 * @type {Collection}
			 */
			this.items	= new Collection();
		});
		Menu.prototype	= {
			/**
			 * Set the identifier of this menu.
			 * @param {string} id
			 * @return {Menu}
			 */
			"setId": function (id) {
				this.id	= id;
				return this;
			},
			/**
			 * Get the identifier of this menu.
			 * @return {string}
			 */
			"getId": function () {
				return this.id;
			},
			/**
			 * Set the title of this menu.
			 * @param {string} title
			 * @return {Menu}
			 */
			"setTitle": function (title) {
				this.title	= title;
				return this;
			},
			/**
			 * Get the title of this menu.
			 * @return {string}
			 */
			"getTitle": function () {
				return this.title;
			},
			/**
			 * Add a menu item to this menu.
			 * @param {cjaf.Widget.Helper.Menu.Item} menu_item
			 * @return {Helper.Menu}
			 */
			"addItem": function (menu_item) {
				this.items.add(menu_item);
				return this;
			},
			/**
			 * Get all the menu items in this menu.
			 * @return {Collection}
			 */
			"getItems": function () {
				return this.items;
			}
		};
		
		return Menu;
	});
}(jQuery, cjaf));