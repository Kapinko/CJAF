/**
 * This is a base class for navigation widgets.
 */
/** JSLint declarations*/
/*global jQuery: false, cjaf: false*/
/*jslint nomen:false*/

(function ($, cjaf) {
	cjaf.define('cjaf/widget/navigation', [
		'lib/event/factory',
		'cjaf/widget/navigation/item'
	],
	/**
	 * @param {EventFactory} EventFactory
	 */
	function (EventFactory) {
		$.widget('cjaf.navigation', {
			/**
			 * These are the available options for this widget and
			 * their associated defaults.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * This is the full path to the initialization view for this
				 * widget.  In this base class it is not set because it is
				 * assumed that the user will want to provide their own.
				 * @type {string}
				 */
				"initViewPath": null,
				/**
				 * This is the locale object that will be passed to the
				 * initialization view template for this widget.
				 * @type {Object.<string,*>}
				 */
				"locale": {},
				/**
				 * This is the jQuery object that will be used as a template 
				 * for the individual navigation items.
				 * @type {jQuery}
				 */
				"itemTemplate": $('<li></li>'),
				/**
				 * This is the view template that will be used to create
				 * each navigation item.
				 * @type {string}
				 */
				"itemViewTemplate": null,
				/**
				 * This is the list of pages that will be included in the 
				 * navigation menu.  You should provide the page url key (minus
				 * the hash (#)) and then you can optionally provide a 
				 * "locale_key" which is what will be used to retrieve the
				 * link's name from the locale object; by default the page key
				 * will be used. Also, you can provide an "isAllowed" function
				 * if this function returns true then the option will be shown,
				 * if not, then the option will be hidden.
				 * @type {Object.<string, Object>}
				 */
				"pageList": {
					'home': {
						'localeKey': 'index',
						'isAllowed': function () {
							return true;
						},
						'subPages': []
					}
				},
				/**
				 * This is the selector that will be used to locate the link
				 * list container within the navigation menu skeleton.
				 * @type {string}
				 */
				"listContainerSelector": '#cjaf-navigation',
				/**
				 *This is the class that should be applied to a navigation item
				 *to denote that it is the currently selected option.
				 * @type {string}
				 */
				"selectedClass": 'current-page'
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
				var o	= this.options,
				el		= this.element;
				
				el.hide();
				el.html(
					cjaf.view(o.initViewPath, {locale: o.locale})
				);
				this._initItems(o.pageList);
				
				if (o.page.hasOwnProperty('id') && o.page.id) {
					this.setPage(o.page);
				}
				el.slideDown();
				
				this.initialized	= true;
			},
			/**
			 * Set the current page for this menu.
			 * @param {Object} page
			 * @return {jQuery}
			 */
			"setPage": function (page) {
				var items	= this.getItems();
				items.each(function () {
					EventFactory.triggerOnElement($(this), 'dispatcher', 'content.change', [page]);
				});
				return this.element;
			},
			/*
			 * Get the navigation url links
			 * @return {jQuery}
			 */
			"getItems": function () {
				return this.element.find(this.options.listContainerSelector).find('li');
			},
			/**
			 * Set up the links.
			 * @param {Object.<string,Object>}
			 */
			_initItems: function (page_list) {
				var o	= this.options,
				list	= this.element.find(o.listContainerSelector),
				key, options, locale_key, item;
				
				for (key in page_list) {
					if (page_list.hasOwnProperty(key)) {
						options		= page_list[key];
						locale_key	= options.hasOwnProperty('localeKey') ? options.localeKey : key;
						
						item		= o.itemTemplate.clone();
						list.append(item);
						
						item.navigation_item({
							"viewTemplate":		o.itemViewTemplate,
							"pageKey":			key,
							"pageName":			o.locale.links[locale_key],
							"isAllowed":		options.hasOwnProperty('isAllowed') ? options.isAllowed : null,
							"subPages":			options.hasOwnProperty('subPages') ? options.subPages : null,
							"selectedClass":	o.selectedClass
						});
					}
				}
			}
		});
	});
}(jQuery, cjaf));