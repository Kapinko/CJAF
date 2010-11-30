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
		 * @param {cjaf.Widget.Helper.Menu} menu
		 */
		Menu.Renderer	= function (menu) {
			this.menu	= menu;
		}
		Menu.Renderer.prototype	= {
			
			/**
			 * This function will render the menu container.
			 * @return {Menu.Renderer}
			 */
			"renderContainer": function () {
				
			},
			/**
			 * This function will render the menu itself.
			 * @return {Menu.Renderer}
			 */
			"renderMenu": function () {
				
			},
			/**
			 * This function will render a given menu item.  Menu items will be
			 * placed into the menu in the order which they are given.
			 * @param {MenuItem} menu_item
			 * @return {Menu.Renderer}
			 */
			"renderMenuItem": function (menu_item) {
				
			}
		};
		return Menu.Renderer;
	});
}(jQuery, cjaf));