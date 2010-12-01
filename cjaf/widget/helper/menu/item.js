/**
 * This is an object that represents a menu item.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/helper/menu/item', [
		'cjaf/widget/helper/menu'
	],
	/**
	 * @param {cjaf.Widget.Helper.Menu} Menu
	 * @return {cjaf.Widget.Helper.Menu.Item}
	 */
	function (Menu) {
		/**
		 * This is an object that is meant to represent a discrete item that
		 * is contained within a menu.
		 * @constructor
		 * @param {string} title
		 * @param {function():boolean} action
		 * @param {function():boolean} is_allowed
		 * @constructor
		 */
		Menu.Item	= function (title, action, is_allowed) {
			/**
			 * This is the title of this menu item.
			 * @type {string}
			 */
			this.title	= title;
			/**
			 * This is the function that will be executed when this action is 
			 * selected.
			 */
			this.action	= action;
			/**
			 * This is the function that will be executed whenever an 
			 * "authorization.change" event occurs.
			 * @type {function():boolean}
			 */
			this.is_allowed	= is_allowed;
		};
		Menu.Item.prototype	= {
			/**
			 * Get the title of this menu item.
			 * @return {string}
			 */
			"getTitle": function () {
				return this.title;
			},
			/**
			 * Is this menu item allowed to be accessed?
			 * @return {boolean}
			 */
			"isAllowed": function () {
				var is_allowed	= true;
				
				if (typeof this.is_allowed === 'function') {
					is_allowed	= this.is_allowed();
				}
				
				return is_allowed;
			}
		};
		
		return Menu.Item;
	});
}(jQuery, cjaf));