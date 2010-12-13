/**
 * This is a menu renderer that will render a menu as an OSX style dock.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('core/widget/helper/menu/renderer/dock', [
		'cjaf/class',
		'core/widget/helper/menu/renderer',
		'jQuery/jquery.jqDock'
	],
	/**
	 * @param {cjaf.Class} Class
	 * @param {cjaf.Widget.Helper.Menu.Renderer} Renderer
	 * @return {cjaf.Widget.Helper.Menu.Renderer.Dock}
	 */
	function (Class, Renderer) {
		var Dock	= cjaf.namespace("Core.Widget.Helper.Menu.Renderer.Dock", 
		Class.extend(Renderer, {
			/**
			 * This function will render the menu itself.
			 * @param {Menu} menu
			 * @return {jQuery}
			 */
			"renderMenu": function (menu) {
				var div	= $('<div>');
				div.addClass(this.menu_class)
					.attr('id', menu.getId());
					
				return div;
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
				
				if (ref) {
					item	= $('<a>');
					item.attr('href', '#' + ref)
						.attr('title', title);
						
					$('<img>').attr('src', menu_item.getImageUrl())
							.attr('alt', '')
							.attr('title', '')
							.appendTo(item);
					
				} else {
					item	= $('<img>');
					item.attr('src', menu_item.getImageUrl())
						.attr('alt', '')
						.attr('title', title);
				}
				return item;
			},
			/**
			 * This is a hook so that child classes can do any necessary 
			 * configuration after the menu has been created but before
			 * we pass the menu of to the user.
			 * @oaram {jQuery} menu_html
			 * @param {Menu} menu
			 * @return {Renderer}
			 */
			"postRenderHook": function (menu_html, menu) {
				var dockOptions	= {
					"align": 'top',
					"labels": true
				};
				menu_html.jqDock(dockOptions);
			}
		}));
		
		return Dock;
	});
}(jQuery, cjaf));