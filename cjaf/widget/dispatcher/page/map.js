/**
 * This is a page map object that will hold a collection of "pages" (really 
 * just a keyed list of widgets) that denotes which page handling widgets should
 * be used for a given "page".
 */
/*global jQuery: false, cjaf: false*/
(function ($, cjaf) {
	cjaf.define('cjaf/widget/dispatcher/page/map', [
		
	],
	function () {
		/**
		 * A Page Map object
		 * @constructor
		 * @param {Object.<string,string>} map
		 */
		var PageMap	= cjaf.namespace("Dispatcher.Page.Map", function (map) {
			
			if (map) {
				this.map	= map;
			} else {
				this.map	= {};
			}
		});
		PageMap.prototype	= {
			/**
			 * This is the identifier of the default page. This page will be 
			 * used if the user specifies an invalid page.
			 * @type {string}
			 */
			default_page: null,
			/**
			 * This the identifier of the page that is currently being displayed.
			 * @type {string}
			 */
			current_page: null,
			/**
			 * This is the identifier of the page that was previously displayed.
			 * @todo Change this to a page stack.
			 * @todo Create a next page stack.
			 * @type {string}
			 */
			previous_page: null,
			/**
			 * Add a page to this map. WARNING: this method IS destructive, if
			 * you specify an identifier of a page that already exists then that
			 * page identifier will be pointed to the new widget; no questions
			 * asked.
			 * @param {string} page_id,
			 * @param {string} widget
			 * @return {PageMap}
			 */
			"add": function (page_id, widget) {
				this.map[page_id]	= widget;
				return this;
			},
			/**
			 * Remove a page representing the given page identifer from this 
			 * page map.  This function will NOT throw an error if the given
			 * page is not present.
			 * @param {string} page_id
			 * @return {PageMap}
			 */
			"remove": function (page_id) {
				delete(this.map[page_id]);
			},
			/**
			 * Get the identifier of the current page.
			 * @return {string}
			 */
			"getCurrent": function () {
				return this.current_page;
			},
			/**
			 * Set the identifier of the current page.
			 * @param {string} page_id
			 * @return {PageMap}
			 */
			"setCurrent": function (page_id) {
				if (this.current_page) {
					this.previous_page	= this.current_page;
				}
				this.current_page	= page_id;
				return this;
			},
			/**
			 * This function will get the identifier of the previous page.
			 * @return {string}
			 */
			"getPrevious": function () {
				return this.previous_page;
			},
			/**
			 * Set the default page
			 * @param {string} page
			 * @return {PageMap}
			 */
			"setDefault": function (page) {
				this.default_page	= page;
				return this;
			},
			/**
			 * Get the default page.
			 * @return {string}
			 */
			"getDefault": function () {
				return this.default_page;
			},
			/**
			 * A method to set the page map in its entirety.
			 * @param {Object.<string,string>} map
			 * @return {PageMap}
			 */
			"setMap": function (map) {
				this.map	= map;
				return this;
			},
			/**
			 * Get the name of the handler widget for the given page.
			 * @param {string} page_id
			 * @param {jQuery} control_el
			 * @return {string}
			 */
			"getWidget": function (page_id, control_el) {
				var widget	= this.map[page_id];
				
				if (!widget) {
					widget	= this.map[this.default_page];
				}
				
				if (!widget) {
					throw "Default page widget could not be found. Listed as: " + this.default_page;
				}
				
				if (control_el && typeof control_el[widget] !== 'function') {
					throw "Page widget: " + widget + ", is not a valid jQueryUI widget.";
				}
				
				return widget;
			}
		};
		return PageMap;
	});
}(jQuery, cjaf));