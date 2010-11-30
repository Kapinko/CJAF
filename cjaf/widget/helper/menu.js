/**
 * This is an object that represents a menu, which is really just a collection
 * of menu items.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function($, cjaf) {
	cjaf.define('cjaf/widget/helper/menu', [
		'cjaf/collection',
		'cjaf/widget/helper',
		'cjaf/widget/helper/menu/item'
	], 
	/**
	 * @param {cjaf.Collection} Collection
	 * @param {Object.<string,*>} Helper
	 * @param {cjaf.Widget.Helper.MenuItem} MenuItem
	 * @return {cjaf.Widget.Helper.Menu}
	 */
	function (Collection, Helper, MenuItem) {
		//Make sure that the "Menu" namespace exists.
		if (Helper.hasOwnProperty('Menu')) {
			return Helper.Menu;
		}
		
		/**
		 * An object to represent a menu (ie. a collection of menu items).
		 * @param {string} title
		 */
		Helper.Menu	= function (title) {
			/**
			 * this is the title of this menu.
			 * @type {string}
			 */
			this.title	= title;
			/**
			 * This is the collection of menu items in this menu.
			 * @type {Collection}
			 */
			this.items	= new Collection();
			
		};
		Helper.Menu.prototype	= {
			/**
			 * Get the title of this menu.
			 */
			"getTitle": function () {
				return this.title;
			},
			/**
			 * Add a menu item to this menu.
			 * @param {MenuItem} menu_item
			 * @return {Helper.Menu}
			 */
			"addItem": function (menu_item) {
				this.collection.add(menu_item);
				return this;
			},
			/**
			 * Get all the menu items in this menu.
			 * @return {Array.<MenuItem>}
			 */
			"getItems": function () {
				return this.collection;
			}
		};
		
		return Helper.Menu;
	});
}(jQuery, cjaf));