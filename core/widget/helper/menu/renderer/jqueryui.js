/**
 * This is a menu renderer that will render a menu as an OSX style dock.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */
(function ($, cjaf) {
	cjaf.define('core/widget/helper/menu/renderer/jqueryui', [
		'cjaf/class',
		'core/widget/helper/menu/renderer'
	],
	/**
	 * @param {cjaf.Class} Class
	 * @param {cjaf.Widget.Helper.Menu.Renderer} Renderer
	 * @return {cjaf.Widget.Helper.Menu.Renderer.Dock}
	 */
	function (Class, Renderer) {
		var jQueryUI	= cjaf.namespace("Core.Widget.Helper.Menu.Renderer.jQueryUI", 
		Class.extend(Renderer, {
			/**
			 * Initialize custom options.
			 */
			"init": function () {
				/**
				* This is the CSS class that will be applied to the menu.
				* @type {string}
				*/
				this.menu_class			= 'ui-menu';
				/**
				* This is the CSS class that will be applied to the menu items.
				* @type {string}
				*/
				this.menu_item_class	= 'ui-menu-item';
			},
			/**
			 * Render the link for a menu item
			 * @param {text}
			 * @param {href}
			 * @return {jQuery}
			 */
			"renderMenuItemLink": function (text, href, title) {
				return $('<input type="button">')
					.addClass(this.menu_item_link_class)
				    .attr("value", text);
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
				menu_html.find('button,input[type="button"]').button();
			}
		}));
		
		return jQueryUI;
	});
}(jQuery, cjaf));