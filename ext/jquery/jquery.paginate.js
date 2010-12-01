/**
 * A pagination plugin that uses jQueryUI compatible styling.
 *
 * This plugin requires jQuery 1.4.2+
 *
 * This plugin is heavily inspired (copied from) Gabriel Birks Pagination plugin.
 * @see http://plugins.jquery.com/project/pagination
 *
 * @author Nathan Sculli (nathan *dot* sculli *at* ecommlink *dot* com)
 * @author Jordan Raub (jordan *dot* raub *at* ecommlink *dot* com)
 * @namespace $.paginate
 * @version 0.1
 * @param {Object} options
 * @return {jQuery} jQuery Object we are attached to.
 */
(function($){
	//Some defaults
	/**
	 * @type {string}
	 * @const
	 */
	var PLUGIN_VERSION_NUMBER		= '0.1';
	/**
	 * This is the property key of the location where we will store instances
	 * of ourselves for each jQuery object that has a paginator attached.
	 * @type {string}
	 * @const
	 */
	var PROP_NAME		= 'PAGINATOR_PLUGIN';
	/**
	 * This is the name of the event that will be triggered when the user
	 * selects a page.
	 * @type {string}
	 */
	var PAGE_SELECTED	= 'PAGINATOR_PLUGIN_PAGE_SELECTED';

	/**
	 * This is the default configuration object.
	 * @type {Object.<string, *>}
	 * @const
	 */
	var DEFAULT_CONFIG	= {
		/**
		 * This is the callback that will be called when we receive a page
		 * change notification.
		 *
		 * @type {function()}
		 */
		'callback':					function() {return false;},
		/**
		 * What is the current page?
		 * @type {number}
		 */
		'currentPage':				0,
		/**
		 * This is the total number of items in the list
		 * we are paginating.
		 * @type {number}
		 */
		'itemsTotal':				null,
		/**
		 * What type of renderer are we going to use?
		 * @type {string}
		 */
		'renderer':					'default',
		/**
		 * What type of paging calculator are we going to use?
		 * @type {string}
		 */
		'calculator':				'default',
		/**
		 * How many items to display per page.
		 * @type {number}
		 */
		'itemsPerPage':				10,
		/**
		 * How many pages to display in the sliding page window.
		 * @type {number}
		 */
		'pageWindowSize':			10,
		/**
		 * Should we use the jQuery UI styling?
		 * @type {boolean}
		 */
		'useJQueryUIStyles':		true,
		/**
		 * How many links should we display at the pagination display edges.
		 * @type {number}
		 */
		'numberOfEdgePageLinks':	2,
		/**
		 * This is a template to use for the ellipse display.
		 * @type {jQuery}
		 */
		'ellipseTemplate':			$('<span class=\"ellipse\">...</span>'),
		/**
		 * This is a string template that will be used for the pagination status
		 * display. The following keys are available and will be replace:
		 *
		 * __start__	-> the starting key of the items being listed.
		 * __end__		-> the ending key of the items being listed..
		 * __total__	-> the total number of items.
		 * @type {string}
		 */
		'statusTextTemplate':		"Showing __start__ to __end__ of __total__ items",
		/**
		 * This is the template we're going to use for the page link URLs.
		 * @type {string}
		 */
		 'pageUrlTemplate':			'#',
		 /**
		  * What text should appear on the "Previous" button.
		  * @type {string}
		  */
		 'previousLinkText':		'&lt;',
		 /**
		  * Should we always display the "Previous" button?
		  * @type {boolean}
		  */
		 'previousLinkAlwaysShow':	true,
		 /**
		  * What text should appear on the "Next" button.
		  * @type {string}
		  */
		 'nextLinkText':			'&gt;',
		 /**
		  * Should we always display the "Next" button?
		  * @type {boolean}
		  */
		 'nextLinkAlwaysShow':		true,
		 /**
		  * This is the template we're going to use to create the page links
		  * @type {jQuery}
		  */
		 'pageTemplate':			$('<button></button>')
	};

	/**
	 * @class Class for calculating pagination values.
	 * @constructor
	 * @param {number} total_items
	 * @param {number} items_per_page
	 * @param {number} window_size
	 */
	var PagingCalculator	= function(total_items, items_per_page, window_size){
		/**
		 * What is the total number of items in the list.
		 * @type {number}
		 * @private
		 */
		this._itemsTotal	= total_items;

		//make sure that we get a sane value for the total number of items
		if(this._itemsTotal < 0){
			throw "The total number of items must be greater than or equal to zero (0).";
		}

		/**
		 * How many items are we going to display per page.
		 * @type {number}
		 * @private
		 */
		this._itemsPerPage	= items_per_page ? items_per_page : DEFAULT_CONFIG['itemsPerPage'];

		//Make sure that we get a sane number of items per page.
		if(this._itemsPerPage < 1){
			throw "The number of items per page must be greater than zero (0).";
		}

		/**
		 * How many page links are we going to display.
		 * @type {number}
		 * @private
		 */
		this._pageWindowSize	= window_size ? window_size : DEFAULT_CONFIG['pageWindowSize'];

		//Make sure that we get a sane paging window size.
		if(this._pageWindowSize < 1){
			throw "The page window size must be greater than zero (0).";
		}

		/**
		 * How many pages are there?
		 * @type {number}
		 * @private
		 */
		this._totalPages		= null;
	}
	$.extend(PagingCalculator.prototype, {
		/**
		 * @method Calculate the maximum number of pages.
		 * @return {number}
		 */
		getPageCount: function(){
			if(!this._totalPages){
				this._totalPages	= Math.ceil(this._itemsTotal / this._itemsPerPage );
			}
			return this._totalPages;
		},
		/**
		 * @method Calculate the start and end point of pagination links
		 * depending on the currentPage and numDisplayEntries
		 * @param {number} current_page
		 * @return {Object.<string, number>}
		 */
		getPageWindowBounds: function(current_page){
			var lower		= null,
				upper		= null,
				window_size	= this._pageWindowSize;

			lower	= current_page - (window_size / 2);

			if(lower <= 0){
				lower	= 1;
				upper	= window_size;
			}

			if(!upper){
				upper	= current_page + (window_size / 2);
			}

			var page_count	= this.getPageCount();
			if(upper >= page_count){
				upper	= page_count
				lower	= page_count - window_size;
			}

			return {
				"lower": Math.floor(Math.max(lower, 0)),
				"upper": Math.ceil(upper)
			};
		}
	});

	/**
	 * @class The abstract page renderer.
	 * @constructor
	 * @param {PagingCalculator} calculator
	 * @param {PageRendererConfig} config
	 */
	var PageRenderer	= function(calculator, config){
		/**
		 * @type {PagingCalculator}
		 */
		this._calculator	= calculator;
		/**
		 * @type {PageRendererConfig}
		 */
		this._config			= config;
	}
	$.extend(PageRenderer.prototype, {
		/**
		 * Render the list of links into the given container and return the
		 * modified container.
		 *
		 * @param {jQuery} container
		 * @param {number} current_page
		 * @param {function()} clickHandler
		 * @return {jQuery}
		 */
		"render": function(container, current_page, clickHandler){
			var window_bounds		= this._calculator.getPageWindowBounds(current_page);

			this._generateStatusText(current_page).appendTo(container);
			
			//Generate the "Previous" link.
			this._generatePreviousLink(current_page).appendTo(container);

			//Generate the starting points.
			this._generateLeadingEdgeLinks(container, current_page, window_bounds);

			//Generate the paging window.
			this._generatePageRange(container, current_page, window_bounds.lower, window_bounds.upper);

			//Generate the ending points.
			this._generateTrailingEdgeLinks(container, current_page, window_bounds);

			//Generate the "Next" link.
			this._generateNextLink(current_page).appendTo(container);

			container.find('a,button').click(clickHandler);

			return container;
		},
		/**
		 * @method Set a new paging calculator for this renderer.
		 * @param {PagingCalculator} calculator
		 * @return {PageRenderer}
		 */
		"setCalculator": function(calculator){
			this._calculator	= calculator;
			return this;
		},
		/**
		 * @method Function to generate the status text. eg "showing 1 of 50"
		 * @param {number} current_page,
		 * @return {jQuery}
		 */
		_generateStatusText: function(current_page){
			var text_container	= $('<div class=\"pagination-status\"></div>'),
				text			= this._getStatusText(current_page);

			text_container.html(text);
			return text_container;
		},
		/**
		 * @method Function to generate a single page link.
		 *
		 * @param {number} page_number the page number for the new item.
		 * @param {number} current_page the page that we're on.
		 * @param {string} text - the text to put on the button/link.
		 */
		_generatePageLink: function(page_number, current_page, text){
			var page			= null;

			page_number		= this._normalizePageNumber(page_number);
			if(page_number == current_page){
				page	= this._getCurrentPageObject(page_number, text);
			} else {
				page	= this._getPageObject(page_number, text);
			}
			
			page.data('page_number', page_number);

			return page;
		},
		/**
		 * Generate a range of page links and append them to the given container
		 * and return the modified container.
		 *
		 * @param {jQuery} container
		 * @param {number} current_page
		 * @param {number} start
		 * @param {number} end
		 * @return {jQuery}
		 */
		_generatePageRange: function(container, current_page, start, end){
			for(var i = start; i < end; i++){
				this._generatePageLink(i, current_page).appendTo(container);
			}
		},
		/**
		 * Function to generate the leading edge page links.
		 * @param {jQuery} container
		 * @param {number} current_page
		 * @param {number} window_bounds
		 * @return {jQuery}
		 */
		_generateLeadingEdgeLinks: function(container, current_page, window_bounds){
			var edge_page_count		= this._config['numberOfEdgePageLinks'],
				ellipse_template	= this._config['ellipseTemplate'];

			if(window_bounds.lower > 0 && edge_page_count > 0){
				var end	= Math.min(edge_page_count, window_bounds.lower);
				this._generatePageRange(container, current_page, 0, end);

				if(edge_page_count < window_bounds.lower && ellipse_template){
					ellipse_template.clone().appendTo(container);
				}
			}
			return container;
		},
		/**
		 * Function to generate the trailing edge page links.
		 * 
		 * @param {jQuery} container
		 * @param {number} current_page
		 * @param {number} window_bounds
		 * @return {jQuery}
		 */
		_generateTrailingEdgeLinks: function(container, current_page, window_bounds){
			var edge_page_count		= this._config['numberOfEdgePageLinks'],
				ellipse_template	= this._config['ellipseTemplate'],
				total_pages			= this._calculator.getPageCount();

			if(window_bounds.upper < total_pages && edge_page_count > 0){
				if(total_pages > edge_page_count && ellipse_template){
					ellipse_template.clone().appendTo(container);
				}
				var begin	= Math.max(total_pages - edge_page_count, window_bounds.upper);
				this._generatePageRange(container, current_page, begin, total_pages);
			}
			return container;
		},
		/**
		 * Generate the "Previous" link.
		 * @param {number} current_page
		 * @return {jQuery}
		 */
		_generatePreviousLink: function(current_page){
			var link	= null,
				text	= this._config['previousLinkText'];

			if(text && (current_page > 0 || this._config['previousLinkAlwaysShow']) ){
				link	= this._generatePageLink(current_page - 1, current_page, text);
			}
			return $(link);
		},
		/**
		 * Generate the "Previous" link.
		 * @param {number} current_page
		 * @return {jQuery}
		 */
		_generateNextLink: function(current_page){
			var link		= null,
				text		= this._config['nextLinkText'],
				total_pages	= this._calculator.getPageCount();

			if(text && (this._config['nextLinkAlwaysShow'] || current_page < total_pages - 1 )){
				link	= this._generatePageLink(current_page + 1, current_page, text);
			}
			return $(link);
		},
		/**
		 * make sure the given page number makes sense.
		 * @param {number} page_number
		 * @return {number}
		 */
		_normalizePageNumber: function(page_number){
			var total_pages	= this._calculator.getPageCount();

			if(page_number < 0){
				page_number	= 0;

			} else if(page_number >= total_pages){
				page_number = total_pages - 1;
			}
			return page_number;
		},
		/**
		 * Get the jQuery object that represents the current page.
		 * @param {number} page_number
		 * @param {string} page_text
		 * @return {jQuery}
		 */
		_getCurrentPageObject: function(page_number, page_text){
			var page	= this._config['pageTemplate'].clone();

			if(!page_text){
				page_text	= page_number + 1
			}

			page.html(page_text);

			if(this._config['useJQueryUIStyles']){
				page.addClass('ui-widget-content ui-state-default');
				page.button({disabled: true});
			}
			return page;
		},
		/**
		 * Get the jQuery object that represents a page for the given page number.
		 * @param {number} page_number
		 * @param {string} page_text
		 * @return {jQuery}
		 */
		_getPageObject: function(page_number, page_text){
			var link	= null;

			if(!page_text){
				page_text	= page_number + 1;
			}

			if(this._config['useJQueryUIStyles']){
				link	= $('<button></button>')
						.addClass('ui-widget-content ui-state-default')
						.html(page_text)
						.button();
			} else {
				link	= this._config['pageTemplate'].clone();
				link.attr('href',this._getPageUrl(page_number)).html(page_text);
			}
			
			return link;
		},
		/**
		 * Get the href value for the given page number.
		 * @param {number} page_number
		 * @return {string}
		 */
		_getPageUrl: function(page_number){
			return this._config['pageUrlTemplate'].replace(/__id__/, page_number);
		},
		/**
		 * Get the status text with all the tokens replaced.
		 * @param {number} current_page
		 * @return {string}
		 */
		_getStatusText: function(current_page){
			var total		= this._config['itemsTotal'],
				per_page	= this._config['itemsPerPage'];

			var start		= per_page * current_page + 1;
			var end			= Math.min(per_page + (current_page * per_page), total);
			

			var template	= this._config['statusTextTemplate'];
			template		= template.replace(/__start__/, start);
			template		= template.replace(/__end__/, end);
			template		= template.replace(/__total__/, total);

			return template;
		}
	});

	/**
	 * @class This is the paginator instance object
	 * @constructor
	 * @param {string} id
	 * @param {jQuery} target
	 * @param {Object.<string, *>} options
	 */
	var Paginator	= function(id, target, options){
		var defaults	= DEFAULT_CONFIG;
		/**
		 * This is the jQuery element that we're attached to.
		 * @type {jQuery}
		 */
		this.target		= target;
		/**
		 * This is the merged object that contains the user settings with
		 * any non-overridden defaults.
		 * @type {Object.<string, *>}
		 */
		this.settings	= $.extend({}, defaults, options);
		/**
		 * This is the renderer that we will use to render our paginator.
		 * @type {PageRenderer}
		 */
		this.renderer	= null;

		if(!$.paginate.Calculators[this.settings.calculator]){
			throw new ReferenceError("Pagination calculator '"+this.settings.calculator + "' was not found in jQuery.paginate.Calculators object store.");
		}

		if(!$.paginate.Renderers[this.settings.renderer]){
			throw new ReferenceError("Pagination renderer '"+this.settings.renderer + "' was not found in jQuery.paginate.Calculators object store.");
		}

		if(this.settings.itemsPerPage > 0 && this.settings.totalItems > 0){
			this.render(this.settings.currentPage);
		}
	}
	$.extend(Paginator.prototype, {
		/**
		 * @method Render the paginator.
		 * @return {Paginator}
		 */
		"render": function(current_page){
			var renderer	= this._getRenderer(),
				container	= this._getContainer(),
				target		= this.target;

			target.data('current_page', current_page);

			var callback	= this._getPageSelectedCallback();
			renderer.render(container, current_page, callback);

			target.html(container)
			return this;
		},
		/**
		 * @method Set the current page.
		 * @param {number} current_page
		 * @return {Paginator}
		 */
		"setCurrentPage": function(current_page){
			this.render(current_page);
			return this;
		},
		/**
		 * Set a given option or range of options.
		 * @param { string | Object.<string, *>} option
		 * @param {*} value
		 * @return {Paginator}
		 */
		"setOption": function(option, value){
			if(typeof option === 'string'){
				this.settings[option]	= value;
			} else {
				$.extend(this.settings, option);
			}
			this._getRenderer(true);
			return this;
		},
		/**
		 * @method Get the inner pager container.
		 * @return {jQuery}
		 */
		_getContainer: function(){
			var container	=  $('<div class=\"pagination\"></div>');

			if(this.settings['useJQueryUIStyles']){
				container.addClass('ui-widget-header ui-corner-all');
			}
			return container;
		},
		/**
		 * @method This is the page selected handler function. It will be called
		 *		whenever a user clicks on one of the pager links.
		 *	@param {jQuery.Event} event
		 *	@return {boolean}
		 */
		_handlePageSelected: function(event){
			var current_page	= $(event.target).data('page_number'),
				items_per_page	= this.settings.itemsPerPage,
				callback		= this.settings.callback,
				target			= this.target;

			//because Webkit is stupid
			if(typeof current_page === 'undefined' || current_page === null){
				current_page	= $(event.target).parent().data('page_number');
			}

			this.render(current_page);

			target.trigger(PAGE_SELECTED, [current_page, items_per_page]);

			var continuePropagation	= callback(current_page, items_per_page);
			if(!continuePropagation){
				if(event.stopPropagation){
					event.stopPropagation();
				} else {
					event.cancelBubble	= true;
				}
			}
			return continuePropagation;
		},
		/**
		 * @method This will return a properly wrapped page selected callback.
		 * @return {function()}
		 */
		_getPageSelectedCallback: function(){
			var self	= this;

			var callback	= function(){
				return self._handlePageSelected.apply(self, arguments);
			}
			return callback;
		},
		/**
		 * @method This function will initialize and return a renderer.
		 * @param {boolean} force_init
		 * @return {PageRenderer}
		 */
		_getRenderer: function(force_init){
			if(force_init || !(this.renderer instanceof PageRenderer)){
				var settings	= this.settings;

				var type		= settings.calculator,
					total		= settings.itemsTotal,
					per_page	= settings.itemsPerPage,
					window		= settings.pageWindowSize,
					renderer	= settings.renderer;
					
				var calculator	= new $.paginate.Calculators[type](total, per_page, window);
				this.renderer	= new $.paginate.Renderers[renderer](calculator, settings);
			}
			return this.renderer;
		}
	});
	
	//Create our namespace.
	$.paginate	= {
		/**
		 * The object container for all paging calculators.
		 * @type {Object.<string, PagingCalculator>}
		 */
		"Calculators": {
			'default': PagingCalculator
		},

		/**
		 * The object container for all pagination renderers.
		 * @type {Object.<string, PageRenderer>}
		 */
		"Renderers": {
			'default': PageRenderer
		},
		/**
		 * Has this plugin been initialized?
		 * @type {boolean}
		 */
		"initialized": false,
		/**
		 * A univerally unique identifier for this plugin.
		 * @type {number}
		 */
		"uuid": new Date().getTime(),
		/**
		 * The version of this plugin.
		 * @type {string}
		 */
		"version": PLUGIN_VERSION_NUMBER,
		/**
		 * @method Tell the paginator to render itself with the given page.
		 * @param {element} target
		 * @param {number} current_page
		 * @return {element}
		 */
		"_renderPaginator": function(target, current_page){
			var inst	= this._getInstance(target);
			inst.render(current_page);
			return target
		},
		/**
		 * @method Set an option or group of options on the paginator.
		 * @param {element} target
		 * @param {(string | Object.<string, *>)} option
		 * @param {*} value
		 * @return {element}
		 */
		"_setOptionPaginator": function(target, option, value){
			var inst		= this._getInstance(target);
			inst.setOption(option, value);
			return target
		},
		/**
		 * @method Set the paginator's current page.
		 * @param {element} target
		 * @param {number} current_page
		 * @return {element}
		 */
		"_setCurrentPagePaginator": function(target, current_page){
			var inst		= this._getInstance(target);
			inst.setCurrentPage(current_page);
			return target;
		},
		/**
		 * @method This is a function to attach the paginator to a given element.
		 * @param {element} target
		 * @param {Object.<string, *>} settings
		 * @return {element}
		 */
		"_attachPaginator": function(target, settings){
			var inst	= this._newInstance($(target), settings);

			$.data(target, PROP_NAME, inst);

			return target;
		},
		/**
		 * @method This will create a new paginator instance for the given
		 *		target element.
		 *	@private
		 *	@param {jQuery} target
		 *	@param {Object.<string, *>} settings
		 *	@return {jQuery}
		 */
		_newInstance: function(target, settings){
			var id		= target[0].id.replace(/([:\[\]\.])/g, '\\\\$1'); // escape jQuery meta chars
			var inst	= new Paginator(id, target, settings);

			return inst;
		},
		/**
		 * @method This will return the paginator instance that is stored
		 *		for the given element.
		 *	@private
		 *	@param {jQuery}
		 *	@return {Paginator}
		 */
		_getInstance: function(target){
			try {
				return $.data(target, PROP_NAME);
			} catch(e){
				throw "Missing instance data for this Paginator.";
			}
		}
	}

	/**
	 * Extend jQuery
	 */
	$.fn.paginate	= function(options){
		if(!$.paginate.initialized){
			//do any initialization work here.
			$.paginate.initialized	= true;
		}
		var otherArgs	= Array.prototype.slice.call(arguments, 1);

		return this.each(function(){
			typeof options	== 'string' ?
				$.paginate['_'+options+'Paginator']
						.apply($.paginate, [this].concat(otherArgs)) :
				$.paginate._attachPaginator(this, options);
		});
	}
})(jQuery);