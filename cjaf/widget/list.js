/**
 * This widget represents a paginated list of items.
 */
/*jslint nomen:false*/
/*global jQuery:false*/

(function ($, cjaf) {
	cjaf.define([
		
	],
	function () {
		$.widget('cjaf.list', {
			/**
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * How many items will we display per page?
				 * @type {number}
				 */
				'itemsPerPage': 4,
				/**
				 * How many pages will we display in the page window.
				 * @type {number}
				 */
				'pageWindowSize': 5,
				/**
				 * These are the options that will be passed to the activity
				 * indicator plugin.
				 * @see http://neteye.github.com/activity-indicator.html
				 */
				'waitOptions': {
					
				},
				/**
				 * This is the CSS class that will be applied to the list element.
				 * (Note: if you override the "renderList" function you will be
				 * passed this as a part of the options, however, it will be 
				 * your responsibility to apply it.)
				 * @type {string}
				 */
				'listClass': 'cjaf-list',
				/**
				 * This function will be be called whenever we want to render
				 * the list markup. It will be executed in the context of this 
				 * widget.
				 * @type {function(Object.<string,*>):string}
				 */
				'renderList': function () {
					var ul	= $('<ul>');
					ul.addClass(this.options.listClass);
					
					return ul;
				},
				/**
				 * This function will be called whenever we want to render the 
				 * markup for a list item. It will be passed the current item's 
				 * position and the object that represents the current item. It
				 * will be executed in the context of this widget.
				 * 
				 * @type {function(Object.<string,*>, number, Object.<string,*>}):string}
				 */
				'renderItem': function (index, item) {
					$.error('You must override the render item function.');
				},
				/**
				 * This function will be called when we want to render an empty
				 * list. It will be executed in the context of this widget.
				 * @type {function(Object.<string,*>):string}
				 */
				'renderListEmpty': function () {
					$.error('You must override the no results view function.');
				},
				/**
				 * This function will be called whenever an error that makes us
				 * unable to render the list has occurred. It will be executed
				 * in the context of this widget.
				 * @type {function(Object.<string,*>|string):string}
				 */
				'renderListError': function (error) {
					$.error('Unable to render list: ' + error);
				},
				/**
				 * This function will be called whenever we want to retrieve the
				 * list of items. It will be passed the current page and will be
				 * executed within the context of this widget.
				 * 
				 * You must provide an array of the items to be rendered and
				 * the total number of items in the collection to the "success"
				 * function. Also, for best results you should use the "error" 
				 * function as your jQuery.ajax error handler function.
				 * @type {function(number, function(), function()):boolean}
				 */
				'fetch': function (page, success, error) {
					$.error('You must override the fetch function.');
				}
			},
			
			_create: function () {
				/**
				 * This is the current page.
				 * @type {number}
				 */
				this.currentPage	= 0;
				
				var el	= this.element;
				
				el.addClass('cjaf-list-container');
			},
			/**
			 * Get this list's current page.
			 * @return {number}
			 */
			'getCurrentPage': function () {
				return this.currentPage;
			},
			/**
			 * Set this list's current page.
			 * @param {number} page
			 * @return {jQuery}
			 */
			'setCurrentPage': function (page) {
				this.currentPage	= page;
				
				//@todo handle current page update.
				
				return this.element;
			},
			/**
			 * @method Set up the list pagination.
			 */
			_initPagination: function () {
				var display	= this._getPagination();
				display.paginate({
					'itemsPerPage': this.options.itemsPerPage,
					'pageWindowSize': this.options.pageWindowSize,
					'callback': $.proxy(function (page, total_pages) {
						return this._fetchItems(page);
					},this)
				});
			},
			/**
			 * Fetch the list of items.
			 * @param {number} page
			 */
			_fetchItems: function (page) {
				this._showInProcess();
				
				var o	= this.options;
				
				o.fetch.apply(this, [
					page,
					$.proxy(this, '_render'),
					$.proxy(this, '_errorHandler')
				]);
			},
			/**
			 * @method Render the list of items using the given array of items.
			 * @param {Array.<*>} items
			 * @param {number} total - the total number of items.
			 */
			_render: function (items, total) {
				if (items.length && items.length > 0) {
					this._haveResultsHandler(items, total);
					
				} else {
					this._noResultsHandler();
				}
			},
			/**
			 * @method Handle a successful item fetch with items to display.
			 * @param {Array.<*>} items
			 * @param {number} total
			 * @return {boolean}
			 */
			_haveResultsHandler: function (items, total) {
				var o	= this.options,
				list	= o.renderList.apply(this, []);
				
				$.each(items, $.proxy(function (index, item) {
					list.append(
						o.renderItem.apply(this, [index, item])
					);
				}, this));

				this._getPagination()
					.paginate('setOption', {'itemsTotal': total})
					.paginate('render', this.getCurrentPage());
				
				this.element.html(list);
				this._hideInProcess();
			},
			/**
			 * @method Handle an empty item list.
			 * @return {boolean}
			 */
			_noResultsHandler: function () {
				this._hideInProcess();
				this._getPagination().hide();
				this.element.html(
					this.options.renderListEmpty.apply(this, [])
				);
				return false;
			},
			/**
			 * @method Handle a list error.
			 * @return {boolean}
			 */
			_errorHandler: function () {
				this.hideInProcess();
				this._getPagination().hide();
				this.element.html(
					this.options.renderListError.appy(this, [])
				);
				return false;
			},
			/**
			 * Show the wait indicator.
			 * @return {jQuery}
			 */
			_showInProgress: function () {
				this.element.activity(this.options.waitOptions);
				
				return this.element;
			},
			/**
			 * Hide the wait indicator.
			 * @return {jQuery}
			 */
			_hideInProgress: function () {
				this.element.activity(false);
				return this.element;
			},
			/**
			 * Get the pagination display.
			 * @return {jQuery}
			 */
			_getPagination: function () {
				return this.element.find('.cjaf-list-pagination');
			}
		});
	});
}(jQuery, cjaf));