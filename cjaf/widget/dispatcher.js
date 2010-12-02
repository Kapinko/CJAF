/** JSLint Declarations */
/*global window: false, document: false, jQuery: false, cjaf: false, alert: false */
/*jslint white:true, browser:true, onevar: false, undef: true, eqeqeq:true, plusplus: true,
bitwise: true, regexp: true, newcap: true, immed: true */

(function ($, cjaf, document) {
	cjaf.define('cjaf/widget/dispatcher', [
		'cjaf/widget/helper/event',
		'cjaf/widget/pluggable',
		'jQuery/jquery.ba-bbq'
	],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 */
	function (EventHelper) {
		/**
		 * This is an object map of all the content events.
		 * @type {Object.<string,*>}
		 */
		var content_events	= EventHelper.dispatcher.content;
		/**
		 * This is an object map of the content events to their handlers.
		 * @type {Array.<Object>}
		 */
		var content_event_map	= [
			{"event": content_events.change, "handler": "_handleContentChange"},
			{"event": content_events.render.start, "handler": "_handleRenderStart"},
			{"event": content_events.transition.hide.complete, "handler": "_handleTransitionOutComplete"},
			{"event": content_events.clear.complete, "handler": "_handleContentClearComplete"},
			{"event": content_events.widget.preload.complete, "handler": "_handleContentPreloadComplete"},
			{"event": content_events.widget.load.complete, "handler": "_handleContentLoadComplete"},
			{"event": content_events.widget.postload.complete, "handler": "_handleContentPostLoadComplete"},
			{"event": content_events.transition.show.complete, "handler": "_handleTransitionInComplete"},
			{"event": content_events.render.complete, "handler": "_handleContentRenderComplete"}
		];
		
		$.widget('cjaf.dispatcher', $.cjaf.pluggable, {
			/**
			 * @type {Object}
			 */
			options: {
				/**
				 * @type {Object}
				 */
				pages: {},
				/**
				 * This should be a page key that exists in the pages map.
				 *
				 * @type {string}
				 */
				defaultPage: 'OVERRIDE THIS VALUE',
				/**
				 *  @type {Object}
				 */
				defaultOverrideCacheEvent: null,
				/**
				 * This is a list of the content events that we listen to and
				 * the associated handling function.
				 * @type {Object.<string,string>}
				 */
				"contentEventBindings": content_event_map,
				/**
				 * This is the content container element.
				 * @type {jQuery}
				 */
				contentElement: null
			},
			/**
			 * This is the page that is currently being displayed.
			 * 
			 * @type {Object}
			 */
			currentPage: null,
			/**
			 * This is the page that was previously displayed.
			 * 
			 * @type {Object}
			 */
			previousPage: null,
			/**
			 * The template for the content container.
			 *
			 * @type {jQuery}
			 */
			contentElementTemplate: null,
			/**
			 * The content container.
			 *
			 * @type {jQuery}
			 */
			contentElement: null,

			/**
			 * Function to initialize this widget.
			 *
			 */
			_create: function () {
				var event_map		= this.options.contentEventBindings,
					content_element	= this.options.contentElement,
					handler			= function (handler, context) {
						return $.proxy(context, handler)
					},
					index, binding;
					
				for (index = 0; index < event_map.length; index += 1) {
					binding	= event_map[index];
					
					if (typeof this[binding.handler] !== 'function') {
						throw "Event handler for the " + binding.event + " event is not valid. [handler=" + binding.handler + "]";
					}
					
					$(document).bind(binding.event, handler(binding.handler, this));
				}
				
				if (content_element) {
					this.setContentElement(content_element);
				}

				this._bindToHistoryPlugin();
			},
			/**
			 * Render a given page.
			 *
			 * @param {Object} page
			 * @return {$.stax.Page}
			 */
			render: function (page) {
				if (!page) {
					var event	= this.getCachedEvent();
					if (event) {
						page	= event.page;
					}
					if (!page) {
						page	= this.getCurrentPage();
					}
					if (!page) {
						page	= {
							id: this.getDefaultPage()
						};
					}
				}
				this._triggerPageEvent(content_events.change, page);
			},

			/**
			 * Integration into the jQuery.ba-bbq plugin.
			 *
			 */
			_bindToHistoryPlugin: function () {
				var self			= this;

				//Override the default behavior of all <a> elements so that,
				//when clicked, their `href` value is pushed onto the history
				//has instead of being navigated to directly.
				self.overridePageLinks	= function () {
					$('a').click(function () {
						var href	= $(this).attr('href');
						$.bbq.pushState({url: href});

						return false;
					});
				};

				/**
				 * Get the page represented by the current URL.
				 *
				 * @return {Object}
				 */
				self.getCurrentPage	= function () {
					var page	= {
						id: $.param.fragment(),
						options: $.deparam.querystring()
					};
					if (!page.id) {
						page.id	= self.getDefaultPage();
					}
					return page;
				};

				//Bind a callback that executes when the document.location.hash changes.
				$(window).bind('hashchange', function (event) {
					var page	= self.getCurrentPage();

					if (page.id && page.id !== 'index') {
						if (!self.getContentElement()) {
							event.page	= page;
							self.options.defaultOverrideCacheEvent	= event;
						} else {
							self._triggerPageEvent(content_events.change, page);
						}
					}
				});

				//override the publish page change event.
				self.publishPageChangeEvent	= function () {
					var page	= self.getCurrentPage();
					self._triggerPageChangeEvent(content_events.change, page);
				};
			},
			/**
			 * Handle the page content change event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentChange: function (event, page) {
				if (this._preRender(page)) {
					this._triggerPageEvent(content_events.render.start, page);
				}
				return false;
			},
			/**
			 * Handle the page content change event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleRenderStart: function (event, page) {
				var self, callback;
				
				self		= this;
				callback	= function () {
					return self._triggerPageEvent(content_events.transition.hide.complete, page);
				};
				this._transitionOut(callback);
				return false;
			},
			/**
			 * Handle the page content transition out complete event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleTransitionOutComplete: function (event, page) {
				this._triggerPageEvent(content_events.clear.start, page);

				this._clear();

				return this._triggerPageEvent(content_events.clear.complete, page);
			},
			/**
			 * Handle the page content clear complete event.
			 *
			 * @param {jQuery.Event} page
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentClearComplete: function (event, page) {
				if (this._preWidgetLoad(page)) {
					this._triggerPageEvent(content_events.widget.preload.complete, page);
				}
				return false;
			},
			/**
			 * Handle the page content preload event complete.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentPreloadComplete: function (event, page) {
				this._triggerPageEvent(content_events.widget.load.start, page);

				if (!page) {
					page	= {id: this.getDefaultPage()};
				}
				this._load(page);

				return this._triggerPageEvent(content_events.widget.load.complete, page);
			},
			/**
			 * Handle the page content load complete event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentLoadComplete: function (event, page) {
				if (this._postWidgetLoad(page)) {
					this._triggerPageEvent(content_events.widget.postload.complete, page);
				}
				return false;
			},
			/**
			 * Handle the page content post-load complete event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentPostLoadComplete: function (event, page) {
				var self, callback;
				
				self		= this;
				callback	= function () {
					return self._triggerPageEvent(content_events.transition.show.complete, page);
				};
				this._transitionIn(callback);
				return false;
			},
			/**
			 * Handle the page content transition in complete event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleTransitionInComplete: function (event, page) {
				if (this._postRender(page)) {
					this._triggerPageEvent(content_events.render.complete, page);
				}
				return false;
			},
			/**
			 * Handle the page content render complete event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentRenderComplete: function (event, page) {
				//umm...?
			},
			/**
			 * Trigger a page event for the given page object.
			 *
			 * @param {string} event_name
			 * @param {Object} page
			 * @return {boolean}
			 */
			_triggerPageEvent: function (event_name, page) {
				$(document).trigger(event_name, [page]);
				return false;
			},
			/**
			 * Fire off the page change event.
			 */
			publishPageChangeEvent: function () {
				throw "This must be overridden inside the _bindToHistoryPlugin implementation.";
			},
			/**
			 * Bind all of the links (anchors) on the page to the history plugin.
			 */
			overridePageLinks: function () {
				throw "This must be overridden inside the _bindToHistoryPlugin implementation.";
			},
			/**
			 * Get the last cached page change event.
			 *
			 * @return {jQuery.Event}
			 */
			getCachedEvent: function () {
				var defaultEvent	= this.options.defaultOverrideCacheEvent;

				if (!defaultEvent || !defaultEvent.event) {
					this.options.defaultOverrideCacheEvent = null;
				}
				return defaultEvent;
			},
			/**
			 * Set the element that is the content container.
			 * 
			 * @param {jQuery} target
			 * @return {jQuery}
			 */
			setContentElement: function (target) {
				var jquery	= target.clone(true);
				jquery.attr('id', '');

				this.contentElementTemplate	= {
					id: target.attr('id'),
					jquery: jquery
				};
				this.options.contentElement	= target;

				return this.element;
			},
			/**
			 * Get the element that is the content container. If it does not exist
			 * create it.
			 *
			 * @return {jQuery}
			 */
			getContentElement: function () {
				if (!this.options.contentElement) {
					var el	= this._createContentElement();
					this.setContentElement(el);

					if (!this.options.contentElement) {
						throw "Unable to create content element.";
					}
				}
				return this.options.contentElement;
			},
			/**
			 * Get the currently rendered page.
			 * 
			 * @return {Object}
			 */
			getCurrentPage: function () {
				return this.currentPage;
			},
			/**
			 * Get the previously rendered
             *
			 * @return {Object}
			 */
			getPreviousPage: function () {
				return this.previousPage;
			},
			/**
			 * Get the default page to render.
			 *
			 * @return {string}
			 */

			getDefaultPage: function () {
				return this.options.defaultPage;
			},
			/**
			 * Set the default page to render.
			 *
			 * @param {string} page_id - page key/identifier.
			 * @return {jQuery}
			 */
			setDefaultPage: function (page_id) {
				this.options.defaultPage	= page_id;
				return this;
			},
			/**
			 * Add the given page to th page map.
			 *
			 * @param {string} id - the page key/identifier for the page map.
			 * @param {string} widget_name - the widget to laod for the page.
			 * @return {jQuery}
			 */
			addPage: function (id, widget_name) {
				this.options.pages[id]	= widget_name;
				return this;
			},
			/**
			 * Remove the given page from the page map.
			 *
			 * @param {string} id - the page/key identifier for the page map.
			 * @return {bool}
			 */
			removePage: function (id) {
				var removed	= false;

				if (this.options.pages.id) {
					this.options.pages.id	= null;
					removed	= true;
				}
				return removed;
			},
			/**
			 * Replace the page map entirely.
			 *
			 * @param {Object} map - a new page mapping.
			 * @return {jQuery}
			 */
			setPageMap: function (map) {
				this.options.pages	= map;
				return this.element;
			},
			/**
			 * Call the pre render function on the registered plugins.
			 * 
			 * @param {Object} target_page - the page we are attempting to load.
			 * @return {bool}
			 */
			_preRender: function (target_page) {
				return this.callMethodOnPlugins(
					'preRender',
					this.getContentElement(),
					this.getCurrentPage(),
					target_page
				);
			},
			/**
			 * Remove the page content from the user's view.
			 * 
			 * @param {function} callback - function to call once the page content
			 *		has been hidden.
			 */
			_transitionOut: function (callback) {
				this.getContentElement().fadeOut('normal', callback);
			},
			/**
			 * Clear the element to prepare to load thenew content.
			 *
			 * @return {jQuery}
			 */
			_clear: function () {
				var target, template, new_target;
				
				target		= this.getContentElement();
				template	= this.contentElementTemplate;

				new_target	= template.jquery.clone();
				target.replaceWith(new_target);
				new_target.attr('id', template.id);
				new_target.css('display', 'none');

				this.options.contentElement	= new_target;

				return new_target;
			},
			/**
			 * Call the pre-widget load method on the registered plugins.
			 *
			 * @param {Object} target_page - the page we are attempting to load.
			 * @return {bool}
			 */
			_preWidgetLoad: function (target_page) {
				return this.callMethodOnPlugins(
					'preWidgetLoad',
					this.getContentElement(),
					this.getCurrentPage(),
					target_page
				);
			},
			/**
			 * Load the requested page into the element content.
			 *
			 * @param {Object} target_page - the page we are attempting to load.
			 * @return {bool}
			 */
			_load: function (target_page) {
				var page_widget	= this._getPageWidget(target_page.id);
				this.getContentElement()[page_widget](target_page.options);

				this._setCurrentPage(target_page);
				return true;
			},
			/**
			 * Call the post controller load method on the registered plugins.
			 * 
			 * @return bool
			 */
			_postWidgetLoad: function () {
				return this.callMethodOnPlugins(
					'postWidgetLoad',
					this.getContentElement(),
					this.getPreviousPage(),
					this.getCurrentPage()
				);
			},
			/**
			 * Place the new content into the user's view.
			 *
			 * @param {function} callback - function to call once the new page content
			 *		has been made visible.
			 */
			_transitionIn: function (callback) {
				this.getContentElement().fadeIn('normal', callback);
			},
			/**
			 * Call post render method on registered plugins.
			 *
			 * @return {bool}
			 */
			_postRender: function () {
				return this.callMethodOnPlugins(
					'postRender',
					this.getContentElement(),
					this.getPreviousPage(),
					this.getCurrentPage()
				);
			},
			/**
			 * Set the current page
			 *
			 * @param {string} page_id
			 * @return {jQuery}
			 */
			_setCurrentPage: function (page_id) {
				this.previousPage	= this.currentPage;
				this.currentPage	= page_id;
				return this.element;
			},
			/**
			 * Get the controller widget name for the given page identifier.
			 *
			 * @param {string} page_id
			 * @return {string}
			 */
			_getPageWidget: function (page_id) {
				var page_list	= this.options.pages,
					page_widget	= page_list[page_id];

				if (!page_widget) {
					page_widget	= page_list[this.options.defaultPage];
				}
				if (!page_widget) {
					throw "Default page widget could not be found. Listed as: " + this.options;
				}
				var content_el	= this.getContentElement();

				if (typeof content_el[page_widget] !== 'function') {
					throw 'Page widget: ' + page_widget + ', is not a valid jQueryUI widget.';
				}
				return page_widget;
			},
			/**
			 * Create a generic content element.
			 *
			 * @return {jQuery}
			 */
			_createContentElement: function () {
				var el	= $(document.createElement('div'));
				el.attr('id', this.widgetName + '-content-area');

				$('body').append(el);

				return el;
			}
		});

		/**
		 * Render the given page, if the page widget exists.
		 *
		 * @param {Object} page
		 */
		$.cjaf.renderPage	= function (page) {
			if ($(document)[page] === 'function') {
				$(document).page('render', page);
			}
		};
	});
}(jQuery, cjaf, window.document));