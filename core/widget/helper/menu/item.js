/**
 * This is an object that represents a menu item.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('core/widget/helper/menu/item', [
		'cjaf/collection'
	],
	/**
	 * @param {cjaf.Collection} Collection
	 * @return {cjaf.Core.Widget.Helper.Menu.Item}
	 */
	function (Collection) {
		var menu_item_counter	= 0,
		Item	= cjaf.namespace("Core.Widget.Helper.Menu.Item", 
		/**
		 * This is an object that is meant to represent a discrete item that
		 * is contained within a menu.
		 * @constructor
		 */
		function () {
			menu_item_counter += 1;
			/**
			 * This is the identifier of this menu item.
			 * @type {string}
			 */
			this.id		= 'CJAF-MenuItem-' + menu_item_counter;
			/**
			 * This is the title of this menu item.
			 * @type {string}
			 */
			this.title	= null;
			/**
			 * This is a reference value for this item. This is in case you need
			 * to associate this item with some sort of identifier.
			 * @type {string}
			 */
			this.ref	= null;
			/**
			 * This is a reference URL for an image that the user wants to associate
			 * with this menu item.
			 * @type {string}
			 */
			this.image_url	= null;
			/**
			 * This is the function that will be executed when this action is 
			 * selected.
			 */
			this.action	= $.noop;
			/**
			 * This is the function that will be executed whenever an 
			 * "authorization.change" event occurs.
			 * @type {function():boolean}
			 */
			this.is_allowed	= function () { 
				return true;
			};
			/**
			 * This is a collection of sub menu items.
			 * @type {Collection}
			 */
			this.sub_menu_items	= new Collection();
			/**
			 * This is a custom CSS class to be applied to the menu link.
			 * @type {string}
			 */
			this.link_class	= '';
		});
		Item.prototype	= {
			/**
			 * Set the identifier of this menu item.
			 * @param {string} id
			 * @return {MenuItem}
			 */
			"setId": function (id) {
				this.id	= id;
				return this;
			},
			/**
			 * Get the identifier of this menu item.
			 * @return {string}
			 */
			"getId": function () {
				return this.id;
			},
			/**
			 * Set the title of this menu.
			 * @param {string} title
			 * @return {MenuItem}
			 */
			"setTitle": function (title) {
				this.title	= title;
				return this;
			},
			/**
			 * Get the title of this menu item.
			 * @return {string}
			 */
			"getTitle": function () {
				return this.title;
			},
			/**
			 * Set a reference value for this item.
			 * @param {string} ref
			 * @return {MenuItem}
			 */
			"setRef": function (ref) {
				this.ref	= ref;
				return this;
			},
			/**
			 * Retrieve the reference value for this item.
			 * @return {string}
			 */
			"getRef": function () {
				return this.ref;
			},
			/**
			 * Set a custom class for the menu item link.
			 * @param {string}
			 * @return {MenuItem}
			 */
			'setLinkClass': function (css_class) {
				this.link_class	= css_class;
				return this;
			},
			/**
			 * Get a custom class fro the menu item link
			 * @return {string}
			 */
			'getLinkClass': function () {
				return this.link_class;
			},
			/**
			 * Set the icon image url for this menu item.
			 * @param {string} url
			 * @return {MenuItem}
			 */
			"setImageUrl": function (url) {
				this.image_url	= url;
				return this;
			},
			/** Get the icon image url for this menu item.
			 * @return {string}
			 */
			"getImageUrl": function () {
				return this.image_url;
			},
			/**
			 * Set the action of this menu item.
			 * @param {function():boolean} action
			 * @return {MenuItem}
			 */
			"setAction": function (action) {
				this.action	= action;
				return this;
			},
			/**
			 * Get the action of this menu item.
			 * @return {function():boolean}
			 */
			"getAction": function () {
				return this.action;
			},
			/**
			 * Set the "is_allowed" function.
			 * @param {function():boolean} auth
			 * @return {MenuItem}
			 */
			"setAuthFunction": function (auth) {
				this.is_allowed	= auth;
				return this;
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
			},
			/**
			 * Get the sub menu items.
			 * @return {cjaf.Collection}
			 */
			"getItems": function () {
				return this.sub_menu_items;
			},
			/**
			 * Add an item to this collection.
			 * @param {cjaf.Widget.Helper.Menu.Item} item
			 * @return {cjaf.Widget.Helper.Menu.Item}
			 */
			"addItem": function (item) {
				this.sub_menu_items.add(item);
				return this;
			}
		};
		
		return Item;
	});
}(jQuery, cjaf));