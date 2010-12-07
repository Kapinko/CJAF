/** JSLint Declarations */
/*global window: false, document: false, jQuery: false, cjaf: false, alert: false */
/*jslint nomen: false */

(function ($, cjaf, document) {
	cjaf.define('cjaf/widget/dispatcher', [
		'cjaf/widget/helper/event',
		'cjaf/widget/dispatcher/page/map',
		'cjaf/widget/pluggable'
	],
	/**
	 * @param {cjaf.Widget.Helper.Event} EventHelper
	 * @param {cjaf.Dispatcher.Page.Map} PageMap
	 */
	function (EventHelper, PageMap) {
		/**
		 * This is an object map of all the content events.
		 * @type {Object.<string,*>}
		 */
		var content_events	= EventHelper.dispatcher.content,
		/**
		 * This is an object map of the content events to their handlers.
		 * @type {Array.<Object>}
		 */
		content_event_map	= [
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
			 *  @type {Object}
			 */
			defaultOverrideCacheEvent: null,
			/**
			 * This is the page map object that we're currently using.
			 * @type {PageMap}
			 */
			page_map: null,
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
				var o				= this.options,
					event_map		= this.options.contentEventBindings,
					content_element	= this.options.contentElement,
					handler			= function (handler, context) {
						return $.proxy(context, handler);
					},
					index, binding;

				for (index = 0; index < event_map.length; index += 1) {
					binding	= event_map[index];
					
					if (typeof this[binding.handler] !== 'function') {
						throw "Event handler for the " + binding.event + " event is not valid. [handler=" + binding.handler + "]";
					}
					
					this.element.bind(binding.event, handler(binding.handler, this));
				}
				
				if (content_element) {
					this.setContentElement(content_element);
				}
				
				this.page_map	= new PageMap(o.pages);
				this.page_map.setDefault(o.defaultPage);
				
				this.defaultOverrideCacheEvent	= o.defaultOverrideCacheEvent;
			},
			/**
			 * Render a given page.
			 *
			 * @param {Object} page
			 * @return {$.stax.Page}
			 */
			render: function (page) {
				if (!page) {
					var event	= this.getCachedEvent(),
					map			= this.page_map;
					if (event) {
						page	= event.page;
					}
					if (!page) {
						page	= map.getCurrent();
					}
					if (!page) {
						page	= {
							id: map.getDefault()
						};
					}
				}
				this._triggerPageEvent(content_events.change, page);
			},
			/**
			 * Are we ready to handle a content change request?
			 * @return {boolean}
			 */
			isReady: function () {
				return this.getContentElement() ? true : false;
			},
			/**
			 * Get the cached event.
			 * @return {jQuery.Event}
			 */
			getCachedEvent: function () {
				return this.defaultOverrideCacheEvent;
			},
			/**
			 * Set the cached event.
			 * @param {jQuery.Event} event
			 */
			setCachedEvent: function (event) {
				this.defaultOverrideCacheEvent	= event;
			},
			/**
			 * Handle the page content change event.
			 *
			 * @param {jQuery.Event} event
			 * @param {Object} page
			 * @return {boolean}
			 */
			_handleContentChange: function (event, page) {
				if (!this.isReady()) {
					event.page	= page;
					this.setCachedEvent(event);
				}
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
					page	= {id: this.page_map.getDefault()};
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
				this.element.trigger(event_name, [page]);
				return false;
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
			 * Call the pre render function on the registered plugins.
			 * 
			 * @param {Object} target_page - the page we are attempting to load.
			 * @return {bool}
			 */
			_preRender: function (target_page) {
				return this.callMethodOnPlugins(
					'preRender',
					this.getContentElement(),
					this.page_map.getCurrent(),
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
				var el	= this.getContentElement();

				if (el.is(':visible')) {
					el.fadeOut('normal', callback);
				} else {
					callback();
				}
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
					this.page_map.getCurrent(),
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
				var content_el	= this.getContentElement(),
				map				= this.page_map, page_widget;
				
				page_widget	= map.getWidget(target_page.id, content_el);

				content_el[page_widget](target_page.options);

				map.setCurrent(target_page);
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
					this.page_map.getPrevious(),
					this.page_map.getCurrent()
				);
			},
			/**
			 * Place the new content into the user's view.
			 *
			 * @param {function} callback - function to call once the new page content
			 *		has been made visible.
			 */
			_transitionIn: function (callback) {
				var el	= this.getContentElement();

				if (el.not(':visible')) {
					el.fadeIn('normal', callback);
				} else {
					callback();
				}
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
					this.page_map.getPrevious(),
					this.page_map.getCurrent()
				);
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