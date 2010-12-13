/**
 * This is a menu renderer that will render a menu as an OSX style dock.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('core/widget/helper/menu/renderer/lava', [
		'cjaf/class',
		'core/widget/helper/menu/renderer',
		'lib/jquery/jquery.lavamenu'
	],
	/**
	 * @param {cjaf.Class} Class
	 * @param {cjaf.Widget.Helper.Menu.Renderer} Renderer
	 * @return {cjaf.Widget.Helper.Menu.Renderer.Dock}
	 */
	function (Class, Renderer) {
		var Dock	= cjaf.namespace("Core.Widget.Helper.Menu.Renderer.Lava", 
		Class.extend(Renderer, {
			/**
			 * This function will render the menu itself.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"renderMenu": function (menu) {
				var container	= $('<ul>');
				container.addClass(this.menu_class)
						.attr('id', menu.getId());
				return container;
			},
			/**
			 * This function will render a given menu item.  Menu items will be
			 * placed into the menu in the order which they are given.
			 * @param {MenuItem} menu_item
			 * @return {jQuery}
			 */
			"renderMenuItem": function (menu_item) {
				var title	= menu_item.getTitle(),
				ref			= menu_item.getRef(), 
				item		= $('<li>');

				if (!title) {
					title	= menu_item.getId();
				}
				
				if (ref) {
					$('<a>').attr('href', '#' + ref)
						.attr('title', title)
						.appendTo(item);
				} else {
					item.html(title);
				}
				
				return item;
			},
			/**
			 * This is a hook so that child classes can do any necessary 
			 * configuration after the menu has been created but before
			 * we pass the menu of to the user.
			 * @param {jQuery} container
			 * @oaram {jQuery} menu_html
			 * @param {Menu} menu
			 * @return {Renderer}
			 */
			"postRenderHook": function (container, menu_html, menu) {
				var options	= {
					
				};
				menu_html.jqDock(options);
			}
		}));
		
		return Dock;
	});
}(jQuery, cjaf));