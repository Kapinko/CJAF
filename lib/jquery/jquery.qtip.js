/*
* qTip2 - Pretty powerful tooltips
* http://craigsworks.com/projects/qtip2/
*
* Version: 2.0.0pre
* Copyright 2009-2010 Craig Michael Thompson - http://craigsworks.com
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
* Date: Wed Feb 23 00:11:30 2011 +0000
*/

"use strict"; // Enable ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
/*jslint browser: true, onevar: true, undef: true, nomen: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/*global window: false, jQuery: false */


(function($, window, undefined) {

	// Munge the primitives - Paul Irish tip
	var TRUE = true,
		FALSE = false,
		NULL = null,
		
		// Shortcut vars
		QTIP, PLUGINS, MOUSE,
		uitooltip = 'ui-tooltip',
		widget = 'ui-widget',
		disabled = 'ui-state-disabled',
		selector = 'div.qtip.'+uitooltip,
		focusClass = uitooltip + '-focus',
		hideOffset = '-31000px',
		replaceSuffix = '_replacedByqTip',
		oldtitle = 'oldtitle';

	// Simple console.error wrapper
	function debug() {
		var c = window.console;
		return c && (c.error || c.log || $.noop).apply(c, arguments);
	}
// Option object sanitizer
function sanitizeOptions(opts)
{
	var content;

	if(!opts || 'object' !== typeof opts) { return FALSE; }

	if('object' !== typeof opts.metadata) {
		opts.metadata = {
			type: opts.metadata
		};
	}

	if('content' in opts) {
		if('object' !== typeof opts.content || opts.content.jquery) {
			opts.content = {
				text: opts.content
			};
		}

		content = opts.content.text || FALSE;
		if(!$.isFunction(content) && ((!content && !content.attr) || content.length < 1 || ('object' === typeof content && !content.jquery))) {
			opts.content.text = FALSE;
		}

		if('title' in opts.content) {
			if('object' !== typeof opts.content.title) {
				opts.content.title = {
					text: opts.content.title
				};
			}

			content = opts.content.title.text || FALSE;
			if(!$.isFunction(content) && ((!content && !content.attr) || content.length < 1 || ('object' === typeof content && !content.jquery))) {
				opts.content.title.text = FALSE;
			}
		}
	}

	if('position' in opts) {
		if('object' !== typeof opts.position) {
			opts.position = {
				my: opts.position,
				at: opts.position
			};
		}
	}

	if('show' in opts) {
		if('object' !== typeof opts.show) {
			if(opts.show.jquery) {
				opts.show = { target: opts.show };
			}
			else {
				opts.show = { event: opts.show };
			}
		}
	}

	if('hide' in opts) {
		if('object' !== typeof opts.hide) {
			if(opts.hide.jquery) {
				opts.hide = { target: opts.hide };
			}
			else {
				opts.hide = { event: opts.hide };
			}
		}
	}

	if('style' in opts) {
		if('object' !== typeof opts.style) {
			opts.style = {
				classes: opts.style
			};
		}
	}

	// Sanitize plugin options
	$.each(PLUGINS, function() {
		if(this.sanitize) { this.sanitize(opts); }
	});

	return opts;
}

/*
* Core plugin implementation
*/
function QTip(target, options, id, attr)
{
	// Declare this reference
	var self = this,
		docBody = document.body,
		tooltipID = uitooltip + '-' + id,
		isPositioning = 0,
		tooltip, elements, cache;

	// Setup class attributes
	self.id = id;
	self.rendered = FALSE;
	self.elements = elements = { target: target };
	self.timers = { img: [] };
	self.options = options;
	self.checks = {};
	self.plugins = {};
	self.cache = cache = {
		event: {},
		target: NULL,
		disabled: FALSE,
		attr: attr
	};

	/*
	* Private core functions
	*/
	function convertNotation(notation)
	{
		var i = 0, obj, option = options, 

		// Split notation into array
		levels = notation.split('.');

		// Loop through
		while( option = option[ levels[i++] ] ) {
			if(i < levels.length) { obj = option; }
		}

		return [obj || options, levels.pop()];
	}

	function isVisible() {
		return tooltip && tooltip.css('left') !== hideOffset && tooltip.css('visibility') !== 'hidden';
	}

	function setWidget() {
		var on = options.style.widget;

		tooltip.toggleClass(widget, on);
		elements.content.toggleClass(widget+'-content', on);
		
		if(elements.titlebar){
			elements.titlebar.toggleClass(widget+'-header', on);
		}
		if(elements.button){
			elements.button.toggleClass(uitooltip+'-icon', !on);
		}
	}

	function removeTitle()
	{
		if(elements.title) {
			elements.titlebar.remove();
			elements.titlebar = elements.title = elements.button = NULL;
			self.reposition();
		}
	}

	function createButton()
	{
		var button = options.content.title.button;

		if(elements.button) { elements.button.remove(); }

		// Use custom button if one was supplied by user, else use default
		if(button.jquery) {
			elements.button = button;
		}
		else {
			elements.button = $('<a />', {
				'class': 'ui-state-default ' + (options.style.widget ? '' : uitooltip+'-icon'),
				'title': 'Close tooltip',
				'aria-label': 'Close tooltip'
			})
			.prepend(
				$('<span />', {
					'class': 'ui-icon ui-icon-close',
					'html': '&times;'
				})
			);
		}

		// Create button and setup attributes
		elements.button.appendTo(elements.titlebar)
			.attr('role', 'button')
			.hover(function(event){ $(this).toggleClass('ui-state-hover', event.type === 'mouseenter'); })
			.click(function(event) {
				if(!tooltip.hasClass(disabled)) { self.hide(event); }
				return FALSE;
			})
			.bind('mousedown keydown mouseup keyup mouseout', function(event) {
				$(this).toggleClass('ui-state-active ui-state-focus', event.type.substr(-4) === 'down');
			});

		// Redraw the tooltip when we're done
		self.redraw();
	}

	function createTitle()
	{
		var id = tooltipID+'-title';

		// Destroy previous title element, if present
		if(elements.titlebar) { removeTitle(); }

		// Create title bar and title elements
		elements.titlebar = $('<div />', {
			'class': uitooltip + '-titlebar ' + (options.style.widget ? 'ui-widget-header' : '')
		})
		.append(
			elements.title = $('<div />', {
				'id': id,
				'class': uitooltip + '-title',
				'aria-atomic': TRUE
			})
		)
		.insertBefore(elements.content);

		// Create button if enabled
		if(options.content.title.button) { createButton(); }

		// Redraw the tooltip dimensions if it's rendered
		else if(self.rendered){ self.redraw(); } 
	}

	function updateButton(button)
	{
		var elem = elements.button,
			title = elements.title;

		// Make sure tooltip is rendered and if not, return
		if(!self.rendered) { return FALSE; }

		if(!button) {
			elem.remove();
		}
		else {
			if(!title) {
				createTitle();
			}
			createButton();
		}
	}

	function updateTitle(content)
	{
		var elem = elements.title;

		// Make sure tooltip is rendered and if not, return
		if(!self.rendered || !content) { return FALSE; }

		// Use function to parse content
		if($.isFunction(content)) {
			content = content.call(target, self) || '';
		}

		// Append new content if its a DOM array and show it if hidden
		if(content.jquery && content.length > 0) {
			elem.empty().append(content.css({ display: 'block' }));
		}

		// Content is a regular string, insert the new content
		else { elem.html(content); }

		// Redraw and reposition
		self.redraw();
		if(self.rendered && isVisible()) {
			self.reposition(cache.event);
		}
	}

	function updateContent(content, reposition)
	{
		var elem = elements.content;

		// Make sure tooltip is rendered and content is defined. If not return
		if(!self.rendered || !content) { return FALSE; }

		// Use function to parse content
		if($.isFunction(content)) {
			content = content.call(target, self) || '';
		}

		// Append new content if its a DOM array and show it if hidden
		if(content.jquery && content.length > 0) {
			elem.empty().append(content.css({ display: 'block' }));
		}

		// Content is a regular string, insert the new content
		else { elem.html(content); }

		// Insert into 'fx' queue our image dimension checker which will halt the showing of the tooltip until image dimensions can be detected
		tooltip.queue('fx', function(next) {
			// Find all content images without dimensions
			var images = elem.find('img:not([height]):not([width])');

			// Update tooltip width and position when all images are loaded
			function imageLoad(img) {
				// Remove the image from the array
				images = images.not(img);

				// If queue is empty, update tooltip and continue the queue
				if(images.length === 0) {
					self.redraw();
					if(self.rendered && isVisible()) {
						self.reposition(cache.event);
					}

					next();
				}
			}

			// Apply the callback to img events and height checker method to ensure queue continues no matter what!
			images.each(function(i, elem) {
				// Apply the imageLoad to regular events to make sure the queue continues
				var events = ['abort','error','load','unload',''].join('.qtip-image ');
				$(this).bind(events, function() {
					clearTimeout(self.timers.img[i]);
					imageLoad(this);
				});

				// Apply a recursive method that polls the image for dimensions every 20ms
				(function timer(){
					// When the dimensions are found, remove the image from the queue
					if(elem.height && elem.width) {
						return imageLoad(elem);
					}

					self.timers.img[i] = setTimeout(timer, 20);
				}());

				return TRUE;
			});

			// If no images were found, continue with queue
			if(images.length === 0) { imageLoad(images);  }
		});

		return self;
	}

	function assignEvents(show, hide, tip, doc)
	{
		var namespace = '.qtip-'+id,
			posOptions = options.position,
			targets = {
				show: options.show.target,
				hide: options.hide.target,
				container: posOptions.container[0] === docBody ? document : posOptions.container
			},
			events = { show: String(options.show.event).split(' '), hide: String(options.hide.event).split(' ') },
			$doc = $(document),
			IE6 = $.browser.msie && parseInt($.browser.version, 10) === 6;

		// Define show event method
		function showMethod(event)
		{
			if(tooltip.hasClass(disabled)) { return FALSE; }

			// If set, hide tooltip when inactive for delay period
			targets.show.trigger('qtip-'+id+'-inactive');

			// Clear hide timers
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);

			// Start show timer
			var callback = function(){ self.show(event); };
			if(options.show.delay > 0) {
				self.timers.show = setTimeout(callback, options.show.delay);
			}
			else{ callback(); }
		}

		// Define hide method
		function hideMethod(event)
		{
			if(tooltip.hasClass(disabled)) { return FALSE; }

			// Check if new target was actually the tooltip element
			var relatedTarget = $(event.relatedTarget || event.target),
				ontoTooltip = relatedTarget.closest(selector)[0] === tooltip[0],
				ontoTarget = relatedTarget[0] === targets.show[0];

			// Clear timers and stop animation queue
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);

			// Prevent hiding if tooltip is fixed and event target is the tooltip. Or if mouse positioning is enabled and cursor momentarily overlaps
			if((posOptions.target === 'mouse' && ontoTooltip) || (options.hide.fixed && ((/mouse(out|leave|move)/).test(event.type) && (ontoTooltip || ontoTarget))))
			{
				// Prevent default and popagation
				event.stopPropagation();
				event.preventDefault();
				return FALSE;
			}

			// If tooltip has displayed, start hide timer
			tooltip.stop(1, 1);

			if(options.hide.delay > 0) {
				self.timers.hide = setTimeout(function(){ self.hide(event); }, options.hide.delay);
			}
			else{ self.hide(event); }
		}

		// Define inactive method
		function inactiveMethod(event)
		{
			if(tooltip.hasClass(disabled)) { return FALSE; }

			// Clear timer
			clearTimeout(self.timers.inactive);
			self.timers.inactive = setTimeout(function(){ self.hide(event); }, options.hide.inactive);
		}

		function repositionMethod(event) {
			if(isVisible()) { self.reposition(event); }
		}

		// Assign tooltip events
		if(tip) {
			// Enable hide.fixed
			if(options.hide.fixed) {
				// Add tooltip as a hide target
				targets.hide = targets.hide.add(tooltip);

				// Clear hide timer on tooltip hover to prevent it from closing
				tooltip.bind('mouseover'+namespace, function() {
					if(!tooltip.hasClass(disabled)) {
						clearTimeout(self.timers.hide);
					}
				});
			}

			// If mouse positioning is on, apply a mouseleave event so we don't get problems with overlapping
			if(posOptions.target === 'mouse' && options.hide.event) {
				tooltip.bind('mouseleave'+namespace, function(event) {
					if((event.relatedTarget || event.target) !== targets.show[0]) { self.hide(event); }
				});
			}

			// Focus/blur the tooltip
			tooltip.bind('mouseenter'+namespace+' mouseleave'+namespace, function(event) {
				self[ event.type === 'mouseenter' ? 'focus' : 'blur' ](event);
			});
		}

		// Assign hide events
		if(hide) {
			// Check if the tooltip hides when inactive
			if('number' === typeof options.hide.inactive)
			{
				// Bind inactive method to target as a custom event
				targets.show.bind('qtip-'+id+'-inactive', inactiveMethod);

				// Define events which reset the 'inactive' event handler
				$.each(QTIP.inactiveEvents, function(index, type){
					targets.hide.add(elements.tooltip).bind(type+namespace+'-inactive', inactiveMethod);
				});
			}

			// Apply hide events
			$.each(events.hide, function(index, type) {
				var showIndex = $.inArray(type, events.show),
					 targetHide = $(targets.hide);

				// Both events and targets are identical, apply events using a toggle
				if((showIndex > -1 && targetHide.add(targets.show).length === targetHide.length) || type === 'unfocus')
				{
					targets.show.bind(type+namespace, function(event)
					{
						if(isVisible()) { hideMethod(event); }
						else{ showMethod(event); }
					});

					// Don't bind the event again
					delete events.show[ showIndex ];
				}

				// Events are not identical, bind normally
				else{ targets.hide.bind(type+namespace, hideMethod); }
			});
		}

		// Apply show events
		if(show) {
			$.each(events.show, function(index, type) {
				targets.show.bind(type+namespace, showMethod);
			});
		}

		// Apply document events
		if(doc) {
			// Adjust positions of the tooltip on window resize if enabled
			if(posOptions.adjust.resize || posOptions.viewport) {
				$($.event.special.resize ? posOptions.viewport : window).bind('resize'+namespace, repositionMethod);
			}

			// Adjust tooltip position on scroll if screen adjustment is enabled
			if(posOptions.viewport || (IE6 && tooltip.css('position') === 'fixed')) {
				$(posOptions.viewport).bind('scroll'+namespace, repositionMethod);
			}

			// Hide tooltip on document mousedown if unfocus events are enabled
			if((/unfocus/i).test(options.hide.event)) {
				$doc.bind('mousedown'+namespace, function(event) {
					var $target = $(event.target);
					
					if($target.parents(selector).length === 0 && $target.add(target).length > 1 && isVisible() && !tooltip.hasClass(disabled)) {
						self.hide(event);
					}
				});
			}

			// If mouse is the target, update tooltip position on document mousemove
			if(posOptions.target === 'mouse') {
				$doc.bind('mousemove'+namespace, function(event) {
					// Update the tooltip position only if the tooltip is visible and adjustment is enabled
					if(posOptions.adjust.mouse && !tooltip.hasClass(disabled) && isVisible()) {
						self.reposition(event || MOUSE);
					}
				});
			}
		}
	}

	function unassignEvents(show, hide, tooltip, doc)
	{
		doc = parseInt(doc, 10) !== 0;
		var namespace = '.qtip-'+id,
			targets = {
				show: show && options.show.target[0],
				hide: hide && options.hide.target[0],
				tooltip: tooltip && self.rendered && elements.tooltip[0],
				content: tooltip && self.rendered && elements.content[0],
				container: doc && options.position.container[0] === docBody ? document : options.position.container[0],
				window: doc && window
			};

		// Check if tooltip is rendered
		if(self.rendered)
		{
			$([]).pushStack(
				$.grep(
					[ targets.show, targets.hide, targets.tooltip, targets.container, targets.content, targets.window ],
					function(){ return this !== FALSE; }
				)
			)
			.unbind(namespace);
		}

		// Tooltip isn't yet rendered, remove render event
		else if(show) { options.show.target.unbind(namespace+'-create'); }
	}

	// Setup builtin .set() option checks
	self.checks.builtin = {
		// Core checks
		'^id$': function(obj, o, v) {
			var id = v === TRUE ? QTIP.nextid : v,
				tooltipID = uitooltip + '-' + id;

			if(id !== FALSE && id.length > 0 && !$('#'+tooltipID).length) {
				tooltip[0].id = tooltipID;
				elements.content[0].id = tooltipID + '-content';
				elements.title[0].id = tooltipID + '-title';
			}
		},

		// Content checks
		'^content.text$': function(obj, o, v){ updateContent(v); },
		'^content.title.text$': function(obj, o, v) {
			// Remove title if content is null
			if(!v) { return removeTitle(); }

			// If title isn't already created, create it now and update
			if(!elements.title && v) { createTitle(); }
			updateTitle(v);
		},
		'^content.title.button$': function(obj, o, v){ updateButton(v); },

		// Position checks
		'^position.(my|at)$': function(obj, o, v){
			// Parse new corner value into Corner objecct
			if('string' === typeof v) {
				obj[o] = new PLUGINS.Corner(v);
			}
		},

		'^position.container$': function(obj, o, v){
			if(self.rendered) { tooltip.appendTo(v); }
		},

		// Show & hide checks
		'^(show|hide).(event|target|fixed|delay|inactive)$': function(obj, o, v, p) {
			var args = o.search(/fixed/i) > -1 ? [0, [0,1,1,1]] : [o.substr(0,3), o.charAt(0) === 's' ? [1,0,0,0] : [0,1,0,0]];

			if(args[0]) { obj[o] = p; }
			unassignEvents.apply(self, args[1]);

			if(args[0]) { obj[o] = v; }
			assignEvents.apply(self, args[1]);
		},
		'^show.ready$': function() { if(!self.rendered) { self.show(); } },

		// Style checks
		'^style.classes$': function(obj, o, v) { 
			$.attr(tooltip[0], 'class', uitooltip + ' qtip ui-helper-reset ' + v);
		},
		'^style.widget|content.title': setWidget,

		// Events check
		'^events.(render|show|move|hide|focus|blur)$': function(obj, o, v) {
			tooltip[($.isFunction(v) ? '' : 'un') + 'bind']('tooltip'+o, v);
		}
	};

	/*
	* Public API methods
	*/
	$.extend(self, {
		render: function(show)
		{
			if(self.rendered) { return FALSE; } // If tooltip has already been rendered, exit

			var content = options.content.text,
				title = options.content.title.text,
				callback = $.Event('tooltiprender');

			// Add ARIA attributes to target
			$.attr(target[0], 'aria-describedby', tooltipID);

			// Create tooltip element
			tooltip = elements.tooltip = $('<div/>')
				.attr({
					'id': tooltipID,
					'class': uitooltip + ' qtip ui-helper-reset ' + options.style.classes,
					
					/* ARIA specific attributes */
					'role': 'alert',
					'aria-live': 'polite',
					'aria-atomic': FALSE,
					'aria-describedby': tooltipID + '-content',
					'aria-hidden': TRUE
				})
				.toggleClass(disabled, cache.disabled)
				.data('qtip', self)
				.appendTo(options.position.container)
				.append(
					// Create content element
					elements.content = $('<div />', {
						'class': uitooltip + '-content',
						'id': tooltipID + '-content',
						'aria-atomic': TRUE
					})
				);

			// Set rendered status
			self.rendered = TRUE;

			// Update title and content
			if(title) { 
				createTitle();
				updateTitle(title);
			}
			updateContent(content);

			// Setup widget classes
			setWidget();

			// Initialize 'render' plugins
			$.each(PLUGINS, function() {
				if(this.initialize === 'render') { this(self); }
			});

			// Assign events
			assignEvents(1, 1, 1, 1);
			$.each(options.events, function(name, callback) {
				if(callback) {
					var events = name === 'toggle' ? 'tooltipshow tooltiphide' : 'tooltip'+name;
					tooltip.bind(events, callback);
				}
			});

			// Set visibility AFTER plugin initialization to prevent issues in IE
			tooltip.css('visibility', 'hidden')

			/* Queue this part of the render process in our fx queue so we can
			 * load images before the tooltip renders fully.
			 *
			 * See: updateContent method
			*/
			.queue('fx', function(next) {
				// Trigger tooltiprender event and pass original triggering event as original
				callback.originalEvent = cache.event;
				tooltip.trigger(callback, [self]);

				// Update tooltip position and show tooltip if needed
				if(options.show.ready || show) {
					self.show(cache.event);
				}

				next(); // Move on
			});

			return self;
		},

		get: function(notation)
		{
			var result, o;

			switch(notation.toLowerCase())
			{
				case 'dimensions':
					result = {
						height: tooltip.outerHeight(), width: tooltip.outerWidth()
					};
				break;

				case 'offset':
					result = PLUGINS.offset(tooltip, options.position.container);
				break;

				default:
					o = convertNotation(notation.toLowerCase());
					result = o[0][ o[1] ];
					result = result.precedance ? result.string() : result;
				break;
			}

			return result;
		},

		set: function(option, value)
		{
			var rmove = /^position.(my|at|adjust|target|container)|style|content/i,
				reposition = FALSE,
				checks = self.checks,
				name;

			function callback(notation, args) {
				var category, rule;

				if(self.rendered) {
					for(category in checks) {
						for(rule in checks[category]) {
							if((new RegExp(rule, 'i')).test(notation)) {
								checks[category][rule].apply(self, args);
							}
						}
					}
				}

				// If we're not rendered and show.ready was set, render it
				else if(notation === 'show.ready' && args[2]) {
					isPositioning = 0; self.render(TRUE);
				}
			}

			// Convert singular option/value pair into object form
			if('string' === typeof option) {
				name = option; option = {}; option[name] = value;
			}
			else { option = $.extend(TRUE, {}, option); }

			// Set all of the defined options to their new values
			$.each(option, function(notation, value) {
				var obj = convertNotation( notation.toLowerCase() ), previous;
				
				// Set new obj value
				previous = obj[0][ obj[1] ];
				obj[0][ obj[1] ] = 'object' === typeof value && value.nodeType ? $(value) : value;

				// Set the new params for the callback and test it against reposition
				option[notation] = [obj[0], obj[1], value, previous];
				reposition = rmove.test(notation) || reposition;
			});

			// Re-sanitize options
			sanitizeOptions(options);

			/*
			 * Execute any valid callbacks for the set options
			 * Also set isPositioning so we don't get loads of redundant repositioning calls
			 */
			isPositioning = 1; $.each(option, callback); isPositioning = 0;

			// Update position on ANY style/position/content change if shown and rendered
			if(reposition && isVisible() && self.rendered) { self.reposition(); }

			return self;
		},

		toggle: function(state, event)
		{
			// Make sure tooltip is rendered
			if(!self.rendered) {
				if(state) { self.render(1); } // Render the tooltip if showing and it isn't already
				else { return FALSE; }
			}

			var type = state ? 'show' : 'hide',
				opts = options[type],
				visible = isVisible(),
				callback;

			// Detect state if valid one isn't provided
			if((typeof state).search('boolean|number')) { state = !visible; }

			// Return if element is already in correct state
			if(visible === state) { return self; }

			// Try to prevent flickering when tooltip overlaps show element
			if(event) {
				if((/over|enter/).test(event.type) && (/out|leave/).test(cache.event.type) &&
					event.target === options.show.target[0] && tooltip.has(event.relatedTarget).length){
					return self;
					}

				// Cache event
				cache.event = $.extend({}, event);
			}

			// Call API methods
			callback = $.Event('tooltip'+type); 
			callback.originalEvent = event ? cache.event : NULL;
			tooltip.trigger(callback, [self, 90]);
			if(callback.isDefaultPrevented()){ return self; }

			// Set ARIA hidden status attribute
			$.attr(tooltip[0], 'aria-hidden', !!!state);

			// Execute state specific properties
			if(state) {
				tooltip.hide().css({ visibility: '' }); // Hide it first so effects aren't skipped
				
				// Focus the tooltip
				self.focus(event);

				// Update tooltip position (without animation)
				self.reposition(event, 0);

				// Hide other tooltips if tooltip is solo, using it as the context
				if(opts.solo) { $(selector, opts.solo).not(tooltip).qtip('hide', callback); }
			}
			else {
				// Clear show timer if we're hiding 
				clearTimeout(self.timers.show);

				// Blur the tooltip
				self.blur(event);
			}

			// Define post-animation state specific properties
			function after() {
				// Prevent antialias from disappearing in IE by removing filter
				if(state) {
					if($.browser.msie) { tooltip[0].style.removeAttribute('filter'); }
				}
				// Hide the tooltip using negative offset and reset opacity
				else {
					tooltip.css({
						display: '',
						visibility: 'hidden',
						width: '',
						opacity: '',
						left: '',
						top: ''
					});
				}
			}

			// Clear animation queue
			tooltip.stop(1, 1);

			// Use custom function if provided
			if($.isFunction(opts.effect)) {
				opts.effect.call(tooltip, self);
				tooltip.queue('fx', function(next){ after.call(this, next); next(); });
			}

			// If no effect type is supplied, use a simple toggle
			else if(opts.effect === FALSE) {
				tooltip[ type ]();
				after.call(tooltip);
			}

			// Use basic fade function by default
			else { tooltip.fadeTo(90, state ? 1 : 0, after); }

			// If inactive hide method is set, active it
			if(state) { opts.target.trigger('qtip-'+id+'-inactive'); }

			return self;
		},

		show: function(event){ return self.toggle(TRUE, event); },

		hide: function(event){ return self.toggle(FALSE, event); },

		focus: function(event)
		{
			if(!self.rendered) { return FALSE; }

			var qtips = $(selector),
				curIndex = parseInt(tooltip[0].style.zIndex, 10),
				newIndex = QTIP.zindex + qtips.length,
				cachedEvent = $.extend({}, event),
				focusedElem, callback;

			// Only update the z-index if it has changed and tooltip is not already focused
			if(!tooltip.hasClass(focusClass))
			{
				// Only update z-index's if they've changed'
				if(curIndex !== newIndex) {
					// Reduce our z-index's and keep them properly ordered
					qtips.each(function() {
						if(this.style.zIndex > curIndex) {
							this.style.zIndex = this.style.zIndex - 1;
						}
					});

					// Fire blur event for focused tooltip
					qtips.filter('.' + focusClass).qtip('blur', cachedEvent);
				}

				// Call API method
				callback = $.Event('tooltipfocus');
				callback.originalEvent = cachedEvent;
				tooltip.trigger(callback, [self, newIndex]);

				// If callback wasn't FALSE
				if(!callback.isDefaultPrevented()) {
					// Set the new z-index
					tooltip.addClass(focusClass)[0].style.zIndex = newIndex;
				}
			}

			return self;
		},

		blur: function(event) {
			var cachedEvent = $.extend({}, event),
				callback;

			// Set focused status to FALSE
			tooltip.removeClass(focusClass);

			// Trigger blur event
			callback = $.Event('tooltipblur');
			callback.originalEvent = cachedEvent;
			tooltip.trigger(callback, [self]);

			return self;
		},

		reposition: function(event, effect)
		{
			if(!self.rendered || isPositioning) { return FALSE; }

			// Set positioning flag
			isPositioning = TRUE;
	
			var target = options.position.target,
				posOptions = options.position,
				my = posOptions.my, 
				at = posOptions.at,
				adjust = posOptions.adjust,
				elemWidth = tooltip.outerWidth(),
				elemHeight = tooltip.outerHeight(),
				targetWidth = 0,
				targetHeight = 0,
				callback = $.Event('tooltipmove'),
				fixed = tooltip.css('position') === 'fixed',
				viewport = posOptions.viewport.jquery ? posOptions.viewport : $(window),
				position = { left: 0, top: 0 },
				tip = (self.plugins.tip || {}).corner,
				readjust = {
					left: function(posLeft) {
						var viewportScroll = viewport.scrollLeft,
							myWidth = my.x === 'left' ? elemWidth : my.x === 'right' ? -elemWidth : -elemWidth / 2,
							atWidth = at.x === 'left' ? targetWidth : at.x === 'right' ? -targetWidth : -targetWidth / 2,
							tipAdjust = tip && tip.precedance === 'x' ? QTIP.defaults.style.tip.width : 0,
							overflowLeft = viewportScroll - posLeft - tipAdjust,
							overflowRight = posLeft + elemWidth - viewport.width - viewportScroll + tipAdjust,
							offset = myWidth - (my.precedance === 'x' || my.x === my.y ? atWidth : 0),
							isCenter = my.x === 'center';

						if(overflowLeft > 0 && (my.x !== 'left' || overflowRight > 0)) {
							position.left -= offset + (isCenter ? 0 : 2 * adjust.x);
						}
						else if(overflowRight > 0 && (my.x !== 'right' || overflowLeft > 0)  ) {
							position.left -= isCenter ? -offset : offset + (2 * adjust.x);
						}
						if(position.left !== posLeft && isCenter) { position.left -= adjust.x; }

						// Make sure we haven't made things worse with the adjustment and return the adjusted difference
						if(position.left < 0 && -position.left > overflowRight) { position.left = posLeft; }
						return position.left - posLeft;
					},
					top: function(posTop) {
						var viewportScroll = viewport.scrollTop,
							myHeight = my.y === 'top' ? elemHeight : my.y === 'bottom' ? -elemHeight : -elemHeight / 2,
							atHeight = at.y === 'top' ? targetHeight : at.y === 'bottom' ? -targetHeight : -targetHeight / 2,
							tipAdjust = tip && tip.precedance === 'y' ? QTIP.defaults.style.tip.height : 0,
							overflowTop = viewportScroll - posTop - tipAdjust,
							overflowBottom = posTop + elemHeight - viewport.height - viewportScroll + tipAdjust,
							offset = myHeight - (my.precedance === 'y' || my.x === my.y ? atHeight : 0),
							isCenter = my.y === 'center';

						if(overflowTop > 0 && (my.y !== 'top' || overflowBottom > 0)) {
							position.top -= offset + (isCenter ? 0 : 2 * adjust.y);
						}
						else if(overflowBottom > 0 && (my.y !== 'bottom' || overflowTop > 0)  ) {
							position.top -= isCenter ? -offset : offset + (2 * adjust.y);
						}
						if(position.top !== posTop && isCenter) { position.top -= adjust.y; }

						// Make sure we haven't made things worse with the adjustment and return the adjusted difference
						if(position.top < 0 && -position.top > overflowBottom) { position.top = posTop; }
						return position.top - posTop;
					}
				};
				effect = effect === undefined || !!effect || FALSE;

			// Cache our viewport details
			viewport = !viewport ? FALSE : {
				elem: viewport,
				height: viewport[ (viewport[0] === window ? 'h' : 'outerH') + 'eight' ](),
				width: viewport[ (viewport[0] === window ? 'w' : 'outerW') + 'idth' ](),
				scrollLeft: viewport.scrollLeft(),
				scrollTop: viewport.scrollTop()
			};

			// Check if mouse was the target
			if(target === 'mouse') {
				// Force left top to allow flipping
				at = { x: 'left', y: 'top' };

				// Use cached event if one isn't available for positioning
				event = event && (event.type === 'resize' || event.type === 'scroll') ? cache.event :
					adjust.mouse || !event || !event.pageX ? $.extend({}, MOUSE) : event;

				// Use event coordinates for position
				position = { top: event.pageY, left: event.pageX };
			}
			else {
				// Check if event targetting is being used
				if(target === 'event') {
					if(event && event.target && event.type !== 'scroll' && event.type !== 'resize') {
						target = cache.target = $(event.target);
					}
					else {
						target = cache.target;
					}
				}

				// Parse the target into a jQuery object and make sure there's an element present
				target = $(target).eq(0);
				if(target.length === 0) { return self; }

				// Check if window or document is the target
				else if(target[0] === document || target[0] === window) {
					targetWidth = target.width();
					targetHeight = target.height();

					if(target[0] === window) {
						position = {
							top: fixed ? 0 : viewport.scrollTop,
							left: fixed ? 0 : viewport.scrollLeft
						};
					}
				}

				// Use Imagemap/SVG plugins if needed
				else if(target.is('area') && PLUGINS.imagemap) {
					position = PLUGINS.imagemap(target, at);
				}
				else if(target[0].namespaceURI == 'http://www.w3.org/2000/svg' && PLUGINS.svg) {
					position = PLUGINS.svg(target, at);
				}

				else {
					targetWidth = target.outerWidth();
					targetHeight = target.outerHeight();

					position = PLUGINS.offset(target, posOptions.container);
				}

				// Parse returned plugin values into proper variables
				if(position.offset) {
					targetWidth = position.width;
					targetHeight = position.height;
					position = position.offset;
				}

				// Adjust position relative to target
				position.left += at.x === 'right' ? targetWidth : at.x === 'center' ? targetWidth / 2 : 0;
				position.top += at.y === 'bottom' ? targetHeight : at.y === 'center' ? targetHeight / 2 : 0;
			}

			// Adjust position relative to tooltip
			position.left += adjust.x + (my.x === 'right' ? -elemWidth : my.x === 'center' ? -elemWidth / 2 : 0);
			position.top += adjust.y + (my.y === 'bottom' ? -elemHeight : my.y === 'center' ? -elemHeight / 2 : 0);

			// Calculate collision offset values
			if(posOptions.viewport.jquery && target[0] !== window && target[0] !== docBody) {
				position.adjusted = { left: readjust.left(position.left), top: readjust.top(position.top) };
			}
			else {
				position.adjusted = { left: 0, top: 0 };
			}

			// Set tooltip position class
			tooltip.attr('class', function(i, val) {
				return $.attr(this, 'class').replace(/ui-tooltip-pos-\w+/i, '');
			})
			.addClass(uitooltip + '-pos-' + my.abbreviation());

			// Call API method
			callback.originalEvent = $.extend({}, event);
			tooltip.trigger(callback, [self, position, viewport.elem]);
			if(callback.isDefaultPrevented()){ return self; }
			delete position.adjusted;

			// If effect is disabled or positioning gives NaN out, set CSS directly
			if(!effect || !isNaN(position.left, position.top)) {
				tooltip.css(position);
			}
			
			// Use custom function if provided
			else if(isVisible() && $.isFunction(posOptions.effect)) {
				posOptions.effect.call(tooltip, self, position);
				tooltip.queue(function(next) {
					var elem = $(this);
					// Reset attributes to avoid cross-browser rendering bugs
					elem.css({ opacity: '', height: '' });
					if($.browser.msie && this.style) { this.style.removeAttribute('filter'); }

					next();
				});
			}

			// Set positioning flag
			isPositioning = FALSE;

			return self;
		},

		// IE max/min height/width simulartor function
		redraw: function()
		{
			// Make sure tooltip is rendered and the browser needs the redraw
			if(!self.rendered || !($.browser.msie && $.browser.version < 8)) { return FALSE; }

			var fluid = uitooltip + '-fluid', dimensions;

			// Reset the height and width and add the fluid class to reset max/min widths
			tooltip.css({ width: 'auto', height: 'auto' }).addClass(fluid);

			// Grab our tooltip dimensions
			dimensions = {
				height: tooltip.outerHeight(),
				width: tooltip.outerWidth()
			};
			
			// Determine actual width
			$.each(['width', 'height'], function(i, prop) {
				// Parse our max/min properties
				var max = parseInt(tooltip.css('max-'+prop), 10) || 0,
					min = parseInt(tooltip.css('min-'+prop), 10) || 0;

				// Determine new dimension size based on max/min/current values
				dimensions[prop] = max + min ? Math.min( Math.max( dimensions[prop], min ), max ) : dimensions[prop];
			});

			// Set the newly calculated dimensions and remvoe fluid class
			tooltip.css(dimensions).removeClass(fluid);

			return self;
		},

		disable: function(state)
		{
			var c = disabled;
			
			if('boolean' !== typeof state) {
				state = !(tooltip.hasClass(c) || cache.disabled);
			}
			 
			if(self.rendered) {
				tooltip.toggleClass(c, state);
				$.attr(tooltip[0], 'aria-disabled', state);
			}
			else {
				cache.disabled = !!state;
			}

			return self;
		},
		
		enable: function() { self.disable(FALSE); },

		destroy: function()
		{
			var t = target[0],
				title = $.data(t, oldtitle);

			// Destroy tooltip and  any associated plugins if rendered
			if(self.rendered) {
				tooltip.remove();
				
				$.each(self.plugins, function() {
					if(this.destroy) { this.destroy(); }
				});
			}

			// Clear timers and remove bound events
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);
			unassignEvents(1, 1, 1, 1);

			// Remove api object
			$.removeData(t, 'qtip');

			// Reset old title attribute if removed 
			if(title) {
				$.attr(t, 'title', title);
			}

			// Remove ARIA attributes and bound qtip events
			target.removeAttr('aria-describedby').unbind('.qtip');

			return target;
		}
	});
}

// Initialization method
function init(id, opts)
{
	var obj, posOptions, attr, config,

	// Setup element references
	elem = $(this),
	docBody = $(document.body),

	// Use document body instead of document element if needed
	newTarget = this === document ? docBody : elem,

	// Grab metadata from element if plugin is present
	metadata = (elem.metadata) ? elem.metadata(opts.metadata) : NULL,

	// If metadata type if HTML5, grab 'name' from the object instead, or use the regular data object otherwise
	metadata5 = opts.metadata.type === 'html5' && metadata ? metadata[opts.metadata.name] : NULL,

	// Grab data from metadata.name (or data-qtipopts as fallback) using .data() method,
	html5 = elem.data(opts.metadata.name || 'qtipopts');

	// If we don't get an object returned attempt to parse it manualyl without parseJSON
	try { html5 = typeof html5 === 'string' ? (new Function("return " + html5))() : html5; }
	catch(e) { debug('Unable to parse HTML5 attribute data: ' + html5); }

	// Merge in and sanitize metadata
	config = $.extend(TRUE, {}, QTIP.defaults, opts, 
		typeof html5 === 'object' ? sanitizeOptions(html5) : NULL,
		sanitizeOptions(metadata5 || metadata));

	// Remove metadata object so we don't interfere with other metadata calls
	if(metadata) { $.removeData(this, 'metadata'); }

	// Re-grab our positioning options now we've merged our metadata and set id to passed value
	posOptions = config.position;
	config.id = id;
	
	// Setup missing content if none is detected
	if('boolean' === typeof config.content.text) {
		attr = elem.attr(config.content.attr);

		// Grab from supplied attribute if available
		if(config.content.attr !== FALSE && attr) { config.content.text = attr; }

		// No valid content was found, abort render
		else { return FALSE; }
	}

	// Setup target options
	if(posOptions.container === FALSE) { posOptions.container = docBody; }
	if(posOptions.target === FALSE) { posOptions.target = newTarget; }
	if(config.show.target === FALSE) { config.show.target = newTarget; }
	if(config.show.solo === TRUE) { config.show.solo = docBody; }
	if(config.hide.target === FALSE) { config.hide.target = newTarget; }
	if(config.position.viewport === TRUE) { config.position.viewport = posOptions.container; }

	// Convert position corner values into x and y strings
	posOptions.at = new PLUGINS.Corner(posOptions.at);
	posOptions.my = new PLUGINS.Corner(posOptions.my);

	// Destroy previous tooltip if overwrite is enabled, or skip element if not
	if($.data(this, 'qtip')) {
		if(config.overwrite) {
			elem.qtip('destroy');
		}
		else if(config.overwrite === FALSE) {
			return FALSE;
		}
	}

	// Remove title attribute and store it if present
	if($.attr(this, 'title')) {
		$.data(this, oldtitle, $.attr(this, 'title'));
		elem.removeAttr('title');
	}

	// Initialize the tooltip and add API reference
	obj = new QTip(elem, config, id, !!attr);
	$.data(this, 'qtip', obj);

	// Catch remove events on target element to destroy redundant tooltip
	elem.bind('remove.qtip', function(){ obj.destroy(); });

	return obj;
}

// jQuery $.fn extension method
QTIP = $.fn.qtip = function(options, notation, newValue)
{
	var command = String(options).toLowerCase(), // Parse command
		returned = NULL,
		args = command === 'disable' ? [TRUE] : $.makeArray(arguments).slice(1, 10),
		event = args[args.length - 1],
		opts = this[0] ? $.data(this[0], 'qtip') : NULL;

	// Check for API request
	if((!arguments.length && opts) || command === 'api') {
		return opts;
	}

	// Execute API command if present
	else if('string' === typeof options)
	{
		this.each(function()
		{
			var api = $.data(this, 'qtip');
			if(!api) { return TRUE; }

			// Cache the event if possible
			if(event && event.timeStamp) { api.cache.event = event; }

			// Check for specific API commands
			if(command === 'option' && notation) {
				if($.isPlainObject(notation) || newValue !== undefined) {
					api.set(notation, newValue);
				}
				else {
					returned = api.get(notation);
					return FALSE;
				}
			}

			// Execute API command
			else if(api[command]) {
				api[command].apply(api[command], args);
			}
		});

		return returned !== NULL ? returned : this;
	}

	// No API commands. validate provided options and setup qTips
	else if('object' === typeof options || !arguments.length)
	{
		opts = sanitizeOptions($.extend(TRUE, {}, options));

		// Bind the qTips
		return QTIP.bind.call(this, opts, event);
	}
};

// $.fn.qtip Bind method
QTIP.bind = function(opts, event)
{
	return this.each(function(i) {
		var options, targets, events,
			
		// Find next available ID, or use custom ID if provided
		id = (!opts.id || opts.id === FALSE || opts.id.length < 1 || $('#'+uitooltip+'-'+opts.id).length) ? QTIP.nextid++ : opts.id,
		
		// Setup events namespace
		namespace = '.qtip-'+id+'-create',

		// Initialize the qTip and re-grab newly sanitized options
		api = init.call(this, id, opts);
		if(api === FALSE) { return TRUE; }
		options = api.options;

		// Initialize plugins
		$.each(PLUGINS, function() {
			if(this.initialize === 'initialize') { this(api); }
		});

		// Determine hide and show targets
		targets = { show: options.show.target, hide: options.hide.target };
		events = {
			show: String(options.show.event).replace(' ', namespace+' ') + namespace,
			hide: String(options.hide.event).replace(' ', namespace+' ') + namespace
		};

		// Define hoverIntent function
		function hoverIntent(event) {
			function render() {
				// Cache mouse coords,render and render the tooltip
				api.render(typeof event === 'object' || options.show.ready);

				// Unbind show and hide event
				targets.show.unbind(events.show);
				targets.hide.unbind(events.hide);
			}

			// Only continue if tooltip isn't disabled
			if(api.cache.disabled) { return FALSE; }

			// Cache the event data
			api.cache.event = $.extend({}, event);

			// Start the event sequence
			if(options.show.delay > 0) {
				clearTimeout(api.timers.show);
				api.timers.show = setTimeout(render, options.show.delay);
				if(events.show !== events.hide) {
					targets.hide.bind(events.hide, function() { clearTimeout(api.timers.show); });
				}
			}
			else { render(); }
		}

		// Bind show events to target
		targets.show.bind(events.show, hoverIntent);

		// Prerendering is enabled, create tooltip now
		if(options.show.ready || options.prerender) { hoverIntent(event); }
	});
};

// Setup base plugins
PLUGINS = QTIP.plugins = {
	// Corner object parser
	Corner: function(corner) {
		corner = String(corner).replace(/([A-Z])/, ' $1').replace(/middle/gi, 'center').toLowerCase();
		this.x = (corner.match(/left|right/i) || corner.match(/center/) || ['inherit'])[0].toLowerCase();
		this.y = (corner.match(/top|bottom|center/i) || ['inherit'])[0].toLowerCase();

		this.precedance = (corner.charAt(0).search(/^(t|b)/) > -1) ? 'y' : 'x';
		this.string = function() { return this.precedance === 'y' ? this.y+this.x : this.x+this.y; };
		this.abbreviation = function() { 
			var x = this.x.substr(0,1), y = this.y.substr(0,1);
			return x === y ? x : (x === 'c' || (x !== 'c' && y !== 'c')) ? y + x : x + y;
		};
	},

	// Custom (more correct for qTip!) offset calculator
	offset: function(elem, container) {
		var pos = elem.offset(),
			parent = container,
			deep = 0,
			docBody = document.body,
			coffset;

		function scroll(e) {
			pos.left -= e.scrollLeft();
			pos.top -= e.scrollTop();
		}

		if(parent) {
			// Compensate for non-static containers offset
			do {
				if(parent[0] === docBody) { break; }
				else if(parent.css('position') !== 'static') {
					coffset = parent.position();
					pos.left -= coffset.left;
					pos.top -= coffset.top;
					
					deep++;
				}
			}
			while(parent = parent.offsetParent());

			// Compensate for containers scroll if it also has an offsetParent
			if(container[0] !== docBody) { scroll( container ); }
			if(PLUGINS.iOS) { scroll( $(window) ); }
		}

		return pos;
	},
	
	/*
	 * iOS 4.0 and below scroll fix detection used in offset() function.
	 */
	iOS: parseFloat(((/CPU.+OS ([0-9_]{3}).*AppleWebkit.*Mobile/i.exec(navigator.userAgent)) || [0,'4_2'])[1].replace('_','.')) < 4.1,
	
	/*
	 * jQuery-secpfic $.fn overrides 
	 */
	fn: {
		/* Allow other plugins to successfully retrieve the title of an element with a qTip applied */
		attr: function(attr, val) {
			if(!this.length) { return; }
			
			var self = this[0],
			title = 'title',
			api = $.data(self, 'qtip');
			
			if(attr === title) {
				if(arguments.length < 2) {
					return $.data(self, oldtitle);
				}
				else if(typeof api === 'object') {
					// If qTip is rendered and title was originally used as content, update it
					if(api && api.rendered && api.options.content.attr === title && api.cache.attr) {
						api.set('content.text', val);
					}
					
					// Use the regular attr method to set, then cache the result
					$.fn['attr'+replaceSuffix].apply(this, arguments);
					$.data(self, oldtitle, $.attr(self, title));
					return this.removeAttr('title');
				}
			}
		},
		
		/* Allow clone to correctly retrieve cached title attributes */
		clone: function(keepData) {
			var titles = $([]), elem;
			
			// Re-add cached titles before we clone
			$('*', this).add(this).each(function() {
				var title = $.data(this, oldtitle);
				if(title) {
					$.attr(this, 'title', title);
					titles = titles.add(this);
				}
			});
			
			// Clone our element using the real clone method
			elem = $.fn['clone'+replaceSuffix].apply(this, arguments);
			
			// Remove the old titles again
			titles.removeAttr('title');
			
			return elem;
		},
		
		/* 
		 * Taken directly from jQuery 1.8.2 widget source code
		 * Trigger 'remove' event on all elements on removal if jQuery UI isn't present 
		 */
		remove: $.ui ? NULL : function( selector, keepData ) {
			$(this).each(function() {
				if (!keepData) {
					if (!selector || $.filter( selector, [ this ] ).length) {
						$('*', this).add(this).each(function() {
							$(this).triggerHandler('remove');
						});
					}
				}
			});
		}
	}
};

// Apply the fn overrides above
$.each(PLUGINS.fn, function(name, func) {
	if(!func) { return TRUE; }
	
	var old = $.fn[name+replaceSuffix] = $.fn[name];
	$.fn[name] = function() {
		return func.apply(this, arguments) || old.apply(this, arguments);
	};
});

// Cache mousemove events for positioning purposes
$(window).bind('load.qtip', function() {
	var type = 'mousemove';
	$(document).bind(type+'.qtip', function(event) {
		MOUSE = { pageX: event.pageX, pageY: event.pageY, type: type };
	});
});

// Set global qTip properties
QTIP.version = '2.0.0pre';
QTIP.nextid = 0;
QTIP.inactiveEvents = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' ');
QTIP.zindex = 15000;

// Define configuration defaults
QTIP.defaults = {
	prerender: FALSE,
	id: FALSE,
	overwrite: TRUE,
	content: {
		text: TRUE,
		attr: 'title',
		title: {
			text: FALSE,
			button: FALSE
		}
	},
	position: {
		my: 'top left',
		at: 'bottom right',
		target: FALSE,
		container: FALSE,
		viewport: FALSE,
		adjust: {
			x: 0, y: 0,
			mouse: TRUE,
			resize: TRUE
		},
		effect: TRUE
	},
	show: {
		target: FALSE,
		event: 'mouseenter',
		effect: TRUE,
		delay: 90,
		solo: FALSE,
		ready: FALSE
	},
	hide: {
		target: FALSE,
		event: 'mouseleave',
		effect: TRUE,
		delay: 0,
		fixed: FALSE,
		inactive: FALSE
	},
	style: {
		classes: '',
		widget: FALSE
	},
	events: {
		render: NULL,
		move: NULL,
		show: NULL,
		hide: NULL,
		toggle: NULL,
		focus: NULL,
		blur: NULL
	}
};function Ajax(api)
{
	var self = this,
		tooltip = api.elements.tooltip,
		opts = api.options.content.ajax,
		namespace = '.qtip-ajax',
		rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

	api.checks.ajax = {
		'^content.ajax': function(obj, name, v) {
			// If content.ajax object was reset, set our local var
			if(name === 'ajax') { opts = v; }

			if(name === 'once') {
				self.once(opts.once);
			}
			else if(opts && opts.url) {
				self.load();
			}
			else {
				self.once(0);
			}
		}
	};

	$.extend(self, {
		init: function()
		{
			// Make sure ajax options are enabled before proceeding
			if(opts && opts.url) {
				self.load();
				tooltip.one('tooltipshow', function() { self.once(opts.once); });
			}
		},

		once: function(state)
		{
			tooltip[ (state ? 'un' : '') + 'bind' ]('tooltipshow'+namespace, self.load);
		},

		load: function()
		{
			var hasSelector = opts.url.indexOf(' '), 
				url = opts.url,
				selector;

			// Check if user delcared a content selector like in .load()
			if(hasSelector > -1) {
				selector = url.substr(hasSelector);
				url = url.substr(0, hasSelector);
			}

			// Define success handler
			function successHandler(content) { 
				if(selector) {
					// Create a dummy div to hold the results and grab the selector element
					content = $('<div/>')
						// inject the contents of the document in, removing the scripts
						// to avoid any 'Permission Denied' errors in IE
						.append(content.replace(rscript, ""))
						
						// Locate the specified elements
						.find(selector);
				}

				// Set the content
				api.set('content.text', content);
			}

			// Error handler
			function errorHandler(xh, status, error){ api.set('content.text', status + ': ' + error); }

			// Setup $.ajax option object and process the request
			$.ajax( $.extend({ success: successHandler, error: errorHandler, context: api }, opts, { url: url }) );

			return self;
		}
	});

	self.init();
}


PLUGINS.ajax = function(api)
{
	var self = api.plugins.ajax;
	
	return 'object' === typeof self ? self : (api.plugins.ajax = new Ajax(api));
};

PLUGINS.ajax.initialize = 'render';

// Setup plugin sanitization
PLUGINS.ajax.sanitize = function(options)
{
	var content = options.content, opts;
	if(content && 'ajax' in content) {
		opts = content.ajax;
		if(typeof opts !== 'object') { opts = options.content.ajax = { url: opts }; }
		if('boolean' !== typeof opts.once && opts.once) { opts.once = !!opts.once; }
	}
};

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
	content: {
		ajax: {
			once: TRUE
		}
	}
});// Tip coordinates calculator
function calculateTip(corner, width, height)
{	
	var width2 = Math.ceil(width / 2), height2 = Math.ceil(height / 2),

	// Define tip coordinates in terms of height and width values
	tips = {
		bottomright:	[[0,0],				[width,height],		[width,0]],
		bottomleft:		[[0,0],				[width,0],				[0,height]],
		topright:		[[0,height],		[width,0],				[width,height]],
		topleft:			[[0,0],				[0,height],				[width,height]],
		topcenter:		[[0,height],		[width2,0],				[width,height]],
		bottomcenter:	[[0,0],				[width,0],				[width2,height]],
		rightcenter:	[[0,0],				[width,height2],		[0,height]],
		leftcenter:		[[width,0],			[width,height],		[0,height2]]
	};

	// Set common side shapes
	tips.lefttop = tips.bottomright; tips.righttop = tips.bottomleft;
	tips.leftbottom = tips.topright; tips.rightbottom = tips.topleft;

	return tips[ corner.string() ];
}


function Tip(qTip, command)
{
	var self = this,
		opts = qTip.options.style.tip,
		elems = qTip.elements,
		tooltip = elems.tooltip,
		cache = { 
			top: 0, 
			left: 0, 
			corner: ''
		},
		size = {
			width: opts.width,
			height: opts.height
		},
		color = { },
		border = opts.border || 0,
		namespace = '.qtip-tip',
		hasCanvas = $('<canvas />')[0].getContext;

	self.corner = NULL;
	self.mimic = NULL;

	// Add new option checks for the plugin
	qTip.checks.tip = {
		'^position.my|style.tip.(corner|mimic|border)$': function() {
			// Make sure a tip can be drawn
			if(!self.init()) {
				self.destroy();
			}

			// Reposition the tooltip
			qTip.reposition();
		},
		'^style.tip.(height|width)$': function() {
			// Re-set dimensions and redraw the tip
			size = {
				width: opts.width,
				height: opts.height
			};
			self.create();
			self.update();

			// Reposition the tooltip
			qTip.reposition();
		},
		'^content.title.text|style.(classes|widget)$': function() {
			if(elems.tip) {
				self.update();
			}
		}
	};

	function reposition(event, api, pos, viewport) {
		if(!elems.tip) { return; }

		var newCorner = $.extend({}, self.corner),
			adjusted = pos.adjusted,
			offset;

		// Make sure our tip position isn't fixed e.g. doesn't adjust with adjust.screen
		if(self.corner.fixed !== TRUE) {
			// Adjust tip corners
			if(adjusted.left) {
				newCorner.x = newCorner.x === 'center' ? (adjusted.left > 0 ? 'left' : 'right') : (newCorner.x === 'left' ? 'right' : 'left');
			}
			if(adjusted.top) {
				newCorner.y = newCorner.y === 'center' ? (adjusted.top > 0 ? 'top' : 'bottom') : (newCorner.y === 'top' ? 'bottom' : 'top');
			}

			// Update and redraw the tip if needed
			if(newCorner.string() !== cache.corner && (cache.top !== adjusted.top || cache.left !== adjusted.left)) {
				offset = self.update(newCorner);
			}
		}

		// Adjust position to accomodate tip dimensions
		if(!offset) { offset = self.position(newCorner, 0); }
		if(offset.right !== undefined) { offset.left = offset.right; }
		if(offset.bottom !== undefined) { offset.top = offset.bottom; }
		offset.option = Math.max(0, opts.offset);

		pos.left -= offset.left.charAt ? offset.option : (offset.right ? -1 : 1) * offset.left;
		pos.top -= offset.top.charAt ? offset.option : (offset.bottom ? -1 : 1) * offset.top;

		// Cache details
		cache.left = adjusted.left; cache.top = adjusted.top;
		cache.corner = newCorner.string();
	}

	/* border width calculator */
	function borderWidth(corner, side, backup) {
		side = !side ? corner[corner.precedance] : side;

		var isTitleTop = elems.titlebar && corner.y === 'top',
			elem = isTitleTop ? elems.titlebar : elems.content,
			css = 'border-' + side + '-width',
			val = parseInt(elem.css(css), 10);

		return (backup ? val || parseInt(tooltip.css(css), 10) : val) || 0;
	}

	function borderRadius(corner) {
		var isTitleTop = elems.titlebar && corner.y === 'top',
			elem = isTitleTop ? elems.titlebar : elems.content,
			moz = $.browser.mozilla,
			prefix = moz ? '-moz-' : $.browser.webkit ? '-webkit-' : '',
			side = corner.y + (moz ? '' : '-') + corner.x,
			css = prefix + (moz ? 'border-radius-' + side : 'border-' + side + '-radius');

		return parseInt(elem.css(css), 10) || parseInt(tooltip.css(css), 10) || 0;
	}

	function calculateSize(corner) {
		var y = corner.precedance === 'y',
			width = size [ y ? 'width' : 'height' ],
			height = size [ y ? 'height' : 'width' ],
			isCenter = corner.string().indexOf('center') > -1,
			base = width * (isCenter ? 0.5 : 1),
			pow = Math.pow,
			round = Math.round,
			bigHyp, ratio, result,

		smallHyp = Math.sqrt( pow(base, 2) + pow(height, 2) ),
		
		hyp = [
			(border / base) * smallHyp, (border / height) * smallHyp
		];
		hyp[2] = Math.sqrt( pow(hyp[0], 2) - pow(border, 2) );
		hyp[3] = Math.sqrt( pow(hyp[1], 2) - pow(border, 2) );

		bigHyp = smallHyp + hyp[2] + hyp[3] + (isCenter ? 0 : hyp[0]);
		ratio = bigHyp / smallHyp;

		result = [ round(ratio * height), round(ratio * width) ];
		return { height: result[ y ? 0 : 1 ], width: result[ y ? 1 : 0 ] };
	}

	$.extend(self, {
		init: function()
		{
			var enabled = self.detectCorner() && (hasCanvas || $.browser.msie);

			// Determine tip corner and type
			if(enabled) {
				// Create a new tip and draw it
				self.create();
				self.update();

				// Bind update events
				tooltip.unbind(namespace).bind('tooltipmove'+namespace, reposition);
			}
			
			return enabled;
		},

		detectCorner: function()
		{
			var corner = opts.corner,
				posOptions = qTip.options.position,
				at = posOptions.at,
				my = posOptions.my.string ? posOptions.my.string() : posOptions.my;

			// Detect corner and mimic properties
			if(corner === FALSE || (my === FALSE && at === FALSE)) {
				return FALSE;
			}
			else {
				if(corner === TRUE) {
					self.corner = new PLUGINS.Corner(my);
				}
				else if(!corner.string) {
					self.corner = new PLUGINS.Corner(corner);
					self.corner.fixed = TRUE;
				}
			}

			return self.corner.string() !== 'centercenter';
		},

		detectColours: function() {
			var tip = elems.tip.css({ backgroundColor: '', border: '' }),
				corner = self.corner,
				precedance = corner[ corner.precedance ],

				borderSide = 'border-' + precedance + '-color',
				borderSideCamel = 'border' + precedance.charAt(0) + precedance.substr(1) + 'Color',

				invalid = /rgba?\(0, 0, 0(, 0)?\)|transparent/i,
				backgroundColor = 'background-color',
				transparent = 'transparent',

				useTitle = elems.titlebar && 
					(corner.y === 'top' || (corner.y === 'center' && tip.position().top + (size.height / 2) + opts.offset < elems.titlebar.outerHeight(1))),
				colorElem = useTitle ? elems.titlebar : elems.content;
				
			// Detect tip colours from CSS styles
			color.fill = tip.css(backgroundColor) || transparent;
			color.border = tip[0].style[ borderSideCamel ];

			// Make sure colours are valid
			if(!color.fill || invalid.test(color.fill)) { 
				color.fill = colorElem.css(backgroundColor);
				if(invalid.test(color.fill)) {
					color.fill = tooltip.css(backgroundColor);
				}
			}
			if(!color.border || invalid.test(color.border)) {
				color.border = tooltip.css(borderSide);
				if(invalid.test(color.border) || color.border === $(document.body).css('color')) { 
					color.border = (colorElem.css(borderSide) !== $(qTip.elements.content).css('color') ? 
						colorElem.css(borderSide) : transparent);
				}
			}

			// Reset background and border colours
			$('*', tip).add(tip).css(backgroundColor, transparent).css('border', '0px dashed transparent');
		},

		create: function()
		{
			var width = size.width,
				height = size.height,
				vml;

			// Remove previous tip element if present
			if(elems.tip) { elems.tip.remove(); }

			// Create tip element and prepend to the tooltip
			elems.tip = $('<div />', { 'class': 'ui-tooltip-tip' }).css({ width: width, height: height }).prependTo(tooltip);

			// Create tip drawing element(s)
			if(hasCanvas) {
				// save() as soon as we create the canvas element so FF2 doesn't bork on our first restore()!
				$('<canvas />').appendTo(elems.tip)[0].getContext('2d').save();
			}
			else {
				vml = '<vml:shape coordorigin="0,0" style="display:block; position:absolute; behavior:url(#default#VML);"></vml:shape>';
				elems.tip.html( border ? vml += vml : vml );
			}
		},

		update: function(corner)
		{
			var tip = elems.tip,
				inner = tip.children(),
				width = size.width,
				height = size.height,
				regular = 'px solid ',
				transparent = 'px dashed transparent', // Dashed IE6 border-transparency hack. Awesome!
				mimic = opts.mimic,
				round = Math.round,
				precedance, context, coords, translate, newSize;

			// Re-determine tip if not already set
			if(!corner) { corner = self.corner; }

			// Use corner property if we detect an invalid mimic value
			if(mimic === FALSE) { mimic = corner; }

			// Otherwise inherit mimic properties from the corner object as necessary
			else {
				mimic = new PLUGINS.Corner(mimic);
				mimic.precedance = corner.precedance;

				if(mimic.x === 'inherit') { mimic.x = corner.x; }
				else if(mimic.y === 'inherit') { mimic.y = corner.y; }
				else if(mimic.x === mimic.y) {
					mimic[ corner.precedance ] = corner[ corner.precedance ];
				}
			}
			precedance = mimic.precedance;

			// Update our colours
			self.detectColours();

			// Detect border width, taking into account colours
			border = color.border === 'transparent' || color.border === '#123456' ? 0 :
				opts.border === TRUE ? borderWidth(corner, NULL, TRUE) : opts.border;

			// Calculate coordinates
			coords = calculateTip(mimic, width , height);

			// Determine tip size
			newSize = calculateSize(corner);
			tip.css(newSize);

			// Calculate tip translation
			if(corner.precedance === 'y') {
				translate = [
					round(mimic.x === 'left' ? border : mimic.x === 'right' ? newSize.width - width - border : (newSize.width - width) / 2),
					round(mimic.y === 'top' ?  newSize.height - height : 0)
				];
			}
			else {
				translate = [
					round(mimic.x === 'left' ? newSize.width - width : 0),
					round(mimic.y === 'top' ? border : mimic.y === 'bottom' ? newSize.height - height - border : (newSize.height - height) / 2)
				];
			}

			// Canvas drawing implementation
			if(hasCanvas) {
				// Set the canvas size using calculated size
				inner.attr(newSize);
				
				// Grab canvas context and clear/save it
				context = inner[0].getContext('2d');
				context.restore(); context.save();
				context.clearRect(0,0,3000,3000);
				
				// Translate origin
				context.translate(translate[0], translate[1]);
				
				// Draw the tip
				context.beginPath();
				context.moveTo(coords[0][0], coords[0][1]);
				context.lineTo(coords[1][0], coords[1][1]);
				context.lineTo(coords[2][0], coords[2][1]);
				context.closePath();
				context.fillStyle = color.fill;
				context.strokeStyle = color.border;
				context.lineWidth = border * 2;
				context.lineJoin = 'miter';
				context.miterLimit = 100;
				context.stroke();
				context.fill();
			}

			// VML (IE Proprietary implementation)
			else {
				// Setup coordinates string
				coords = 'm' + coords[0][0] + ',' + coords[0][1] + ' l' + coords[1][0] +
					',' + coords[1][1] + ' ' + coords[2][0] + ',' + coords[2][1] + ' xe';

				// Setup VML-specific offset for pixel-perfection
				translate[2] = border && /^(r|b)/i.test(corner.string()) ? 1 : 0;

				// Set initial CSS
				inner.css({
					antialias: ''+(mimic.string().indexOf('center') > -1),
					left: translate[0] - (translate[2] * Number(precedance === 'x')),
					top: translate[1] - (translate[2] * Number(precedance === 'y')),
					width: width + border,
					height: height + border
				})
				.each(function(i) {
					var $this = $(this);

					// Set shape specific attributes
					$this.attr({
						coordsize: (width+border) + ' ' + (height+border),
						path: coords,
						fillcolor: color.fill,
						filled: !!i,
						stroked: !!!i
					})
					.css({ display: border || i ? 'block' : 'none' });

					// Check if border is enabled and add stroke element
					if(!i && border > 0 && $this.html() === '') {
						$this.html(
							'<vml:stroke weight="'+(border*2)+'px" color="'+color.border+'" miterlimit="1000" joinstyle="miter" ' +
							' style="behavior:url(#default#VML); display:block;" />'
						);
					}
				});
			}

			return self.position(corner, 1);
		},

		// Tip positioning method
		position: function(corner, set)
		{
			var tip = elems.tip,
				position = {},
				offset = Math.max(0, opts.offset),
				precedance, dimensions, 
				adjust;

			// Return if tips are disabled or tip is not yet rendered
			if(opts.corner === FALSE || !tip) { return FALSE; }

			// Inherit corner if not provided
			corner = corner || self.corner;
			precedance = corner.precedance;

			// Determine which tip dimension to use for adjustment
			dimensions = calculateSize(corner);

			// Setup IE specific dimension adjustment
			adjust = $.browser.msie && border && /^(b|r)/i.test(corner.string()) ? 1 : 0;

			// Calculate tip position
			$.each(
				precedance === 'y' ? [ corner.x, corner.y ] : [ corner.y, corner.x ],
				function(i, side)
				{
					var b, br;

					if(side === 'center') {
						b = precedance === 'y' ? 'left' : 'top';
						position[ b ] = '50%';
						position['margin-' + b] = -Math.round(dimensions[ precedance === 'y' ? 'width' : 'height' ] / 2) + offset;
					}
					else {
						b = borderWidth(corner, side, TRUE);
						br = borderRadius(corner);

						position[ side ] = i || !border ?
							borderWidth(corner, side) + (!i ? br : 0) :
							offset + (br > b ? br : 0);
					}
				}
			);
			position[ corner[precedance] ] -= dimensions[ precedance === 'x' ? 'width' : 'height' ] + adjust;

			// Set and return new position
			if(set) { tip.css({ top: '', bottom: '', left: '', right: '', margin: '' }).css(position); }
			return position;
		},
		
		destroy: function()
		{
			// Remov tip and bound events
			if(elems.tip) { elems.tip.remove(); }
			tooltip.unbind(namespace);
		}
	});
	
	self.init();
}

PLUGINS.tip = function(api)
{
	var self = api.plugins.tip;
	
	return 'object' === typeof self ? self : (api.plugins.tip = new Tip(api));
};

// Initialize tip on render
PLUGINS.tip.initialize = 'render';

// Setup plugin sanitization options
PLUGINS.tip.sanitize = function(options)
{
	var style = options.style, opts;
	if(style && 'tip' in style) {
		opts = options.style.tip;
		if(typeof opts !== 'object'){ options.style.tip = { corner: opts }; }
		if(!(/string|boolean/i).test(typeof opts.corner)) { opts.corner = TRUE; }
		if(typeof opts.width !== 'number'){ delete opts.width; }
		if(typeof opts.height !== 'number'){ delete opts.height; }
		if(typeof opts.border !== 'number' && opts.border !== TRUE){ delete opts.border; }
		if(typeof opts.offset !== 'number'){ delete opts.offset; }
	}
};

// Extend original qTip defaults
$.extend(TRUE, QTIP.defaults, {
	style: {
		tip: {
			corner: TRUE,
			mimic: FALSE,
			width: 6,
			height: 6,
			border: TRUE,
			offset: 0
		}
	}
});PLUGINS.imagemap = function(area, corner)
{
	var shape = area.attr('shape').toLowerCase(),
		baseCoords = area.attr('coords').split(','),
		coords = [],
		image = $('img[usemap="#'+area.parent('map').attr('name')+'"]'),
		imageOffset = image.offset(),
		result = {
			width: 0, height: 0,
			offset: { top: 1e10, right: 0, bottom: 0, left: 1e10 }
		},
		i = 0, next = 0;

	// POLY area coordinate calculator
	//	Special thanks to Ed Cradock for helping out with this.
	//	Uses a binary search algorithm to find suitable coordinates.
	function polyCoordinates(result, coords)
	{
		var i = 0,
			compareX = 1, compareY = 1,
			realX = 0, realY = 0,
			newWidth = result.width,
			newHeight = result.height;

		// Use a binary search algorithm to locate most suitable coordinate (hopefully)
		while(newWidth > 0 && newHeight > 0 && compareX > 0 && compareY > 0)
		{
			newWidth = Math.floor(newWidth / 2);
			newHeight = Math.floor(newHeight / 2);

			if(corner.x === 'left'){ compareX = newWidth; }
			else if(corner.x === 'right'){ compareX = result.width - newWidth; }
			else{ compareX += Math.floor(newWidth / 2); }

			if(corner.y === 'top'){ compareY = newHeight; }
			else if(corner.y === 'bottom'){ compareY = result.height - newHeight; }
			else{ compareY += Math.floor(newHeight / 2); }

			i = coords.length; while(i--)
			{
				if(coords.length < 2){ break; }

				realX = coords[i][0] - result.offset.left;
				realY = coords[i][1] - result.offset.top;

				if((corner.x === 'left' && realX >= compareX) ||
				(corner.x === 'right' && realX <= compareX) ||
				(corner.x === 'center' && (realX < compareX || realX > (result.width - compareX))) ||
				(corner.y === 'top' && realY >= compareY) ||
				(corner.y === 'bottom' && realY <= compareY) ||
				(corner.y === 'center' && (realY < compareY || realY > (result.height - compareY)))) {
					coords.splice(i, 1);
				}
			}
		}

		return { left: coords[0][0], top: coords[0][1] };
	}

	// Make sure we account for padding and borders on the image
	imageOffset.left += Math.ceil((image.outerWidth() - image.width()) / 2);
	imageOffset.top += Math.ceil((image.outerHeight() - image.height()) / 2);

	// Parse coordinates into proper array
	if(shape === 'poly') {
		i = baseCoords.length; while(i--)
		{
			next = [ parseInt(baseCoords[--i], 10), parseInt(baseCoords[i+1], 10) ];

			if(next[0] > result.offset.right){ result.offset.right = next[0]; }
			if(next[0] < result.offset.left){ result.offset.left = next[0]; }
			if(next[1] > result.offset.bottom){ result.offset.bottom = next[1]; }
			if(next[1] < result.offset.top){ result.offset.top = next[1]; }

			coords.push(next);
		}
	}
	else {
		coords = $.map(baseCoords, function(coord){ return parseInt(coord, 10); });
	}

	// Calculate details
	switch(shape)
	{
		case 'rect':
			result = {
				width: Math.abs(coords[2] - coords[0]),
				height: Math.abs(coords[3] - coords[1]),
				offset: { left: coords[0], top: coords[1] }
			};
		break;

		case 'circle':
			result = {
				width: coords[2] + 2,
				height: coords[2] + 2,
				offset: { left: coords[0], top: coords[1] }
			};
		break;

		case 'poly':
			$.extend(result, {
				width: Math.abs(result.offset.right - result.offset.left),
				height: Math.abs(result.offset.bottom - result.offset.top)
			});

			if(corner.string() === 'centercenter') {
				result.offset = {
					left: result.offset.left + (result.width / 2),
					top: result.offset.top + (result.height / 2)
				};
			}
			else {
				result.offset = polyCoordinates(result, coords.slice());
			}

			result.width = result.height = 0;
		break;
	}

	// Add image position to offset coordinates
	result.offset.left += imageOffset.left;
	result.offset.top += imageOffset.top;

	return result;
};

PLUGINS.svg = function(svg, corner)
{
	var doc = $(document),
		elem = svg[0],
		result = {
			width: 0, height: 0,
			offset: { top: 1e10, left: 1e10 }
		},
		box, mtx, root, point, tPoint;

	if (elem.getBBox && elem.parentNode) {
		box = elem.getBBox();
		mtx = elem.getScreenCTM();
		root = elem.farthestViewportElement || elem;

		// Return if no method is found
		if(!root.createSVGPoint) { return result; }

		// Create our point var
		point = root.createSVGPoint();

		// Adjust top and left
		point.x = box.x;
		point.y = box.y;
		tPoint = point.matrixTransform(mtx);
		result.offset.left = tPoint.x;
		result.offset.top = tPoint.y;

		// Adjust width and height
		point.x += box.width;
		point.y += box.height;
		tPoint = point.matrixTransform(mtx);
		result.width = tPoint.x - result.offset.left;
		result.height = tPoint.y - result.offset.top;

		// Adjust by scroll offset
		result.offset.left += doc.scrollLeft();
		result.offset.top += doc.scrollTop();
	}

	return result;
};

function Modal(api)
{
	var self = this,
		options = api.options.show.modal,
		elems = api.elements,
		tooltip = elems.tooltip,
		
		selector = '#qtip-overlay',
		namespace = '.qtipmodal',
		events = 'tooltipshow'+namespace+' tooltiphide'+namespace;

	// Setup option set checks
	api.checks.modal = {
		'^show.modal.(on|blur)$': function() {
			// Initialise
			self.init();
			
			// Show the modal if not visible already and tooltip is visible
			elems.overlay.toggle( tooltip.is(':visible') );
		}
	};

	$.extend(self, {
		init: function()
		{
			if(options.on) {
				// Apply our modal events (unbind the mfirst so we don't duplicate)
				tooltip.unbind(namespace).bind(events, function(event, api, duration) {
					var type = event.type.replace('tooltip', '');

					if($.isFunction(options[type])) {
						options[type].call(elems.overlay, duration, api);
					}
					else {
						self[type](duration);
					}
				});

				// Create the overlay if needed
				self.create();

				// Hide tooltip on overlay click if enabled and toggle cursor style
				if(options.blur === TRUE) {
					elems.overlay.unbind(namespace+api.id).bind('click'+namespace+api.id, function(){ api.hide.call(api); });
				}
				elems.overlay.css('cursor', options.blur ? 'pointer' : '');
			}
		},

		create: function()
		{
			var elem = $(selector), overlay;

			// Return if overlay is already rendered
			if(elem.length) { elems.overlay = elem; return elem; }

			// Create document overlay
			overlay = elems.overlay = $('<div />', {
				id: selector.substr(1),
				css: {
					position: 'absolute',
					top: 0,
					left: 0,
					display: 'none'
				},
				mousedown: function() { return FALSE; }
			})
			.appendTo(document.body);

			// Update position on window resize or scroll
			$(window).bind('resize'+namespace, function() {
				overlay.css({
					height: Math.max( $(window).height(), $(document).height() ),
					width: Math.max( $(window).width(), $(document).width() )
				});
			})
			.trigger('resize');

			return overlay;
		},

		toggle: function(state)
		{
			var overlay = elems.overlay,
				effect = api.options.show.modal.effect,
				type = state ? 'show': 'hide',
				zindex;

			// Create our overlay if it isn't present already
			if(!overlay) { overlay = self.create(); }

			// Prevent modal from conflicting with show.solo
			if(overlay.is(':animated') && !state) { return; }

			// Setop all animations
			overlay.stop(TRUE, FALSE);

			// Set z-indx if we're showing it
			if(state) {
				zindex = parseInt( $.css(tooltip[0], 'z-index'), 10);
				overlay.css('z-index', (zindex || QTIP.zindex) - 1);
			}

			// Use custom function if provided
			if($.isFunction(effect)) {
				effect.call(overlay, state);
			}

			// If no effect type is supplied, use a simple toggle
			else if(effect === FALSE) {
				overlay[ type ]();
			}

			// Use basic fade function
			else {
				overlay.fadeTo(90, state ? 0.7 : 0, function() {
					if(!state) { $(this).hide(); }
				});
			}
		},

		show: function() { self.toggle(TRUE); },
		hide: function() { self.toggle(FALSE); },

		destroy: function()
		{
			var delBlanket = elems.overlay;

			if(delBlanket) {
				// Check if any other modal tooltips are present
				$(selector).each(function() {
					var api = $(this).data('qtip');

					// If another modal tooltip is present, leave overlay
					if(api && api.id !== api.id && api.options.show.modal) {
						return (delBlanket = FALSE);
					}
				});

				// Remove overlay if needed
				if(delBlanket) {
					elems.overlay.remove();
					$(window).unbind(namespace);
				}
				else {
					elems.overlay.unbind(namespace+api.id);
				}
			}

			// Remove bound events
			tooltip.unbind(events);
		}
	});

	self.init();
}

PLUGINS.modal = function(api)
{
	var self = api.plugins.modal;

	return 'object' === typeof self ? self : (api.plugins.modal = new Modal(api));
};

// Plugin needs to be initialized on render
PLUGINS.modal.initialize = 'render';

// Setup sanitiztion rules
PLUGINS.modal.sanitize = function(opts) {
	if(opts.show) { 
		if(typeof opts.show.modal !== 'object') { opts.show.modal = { on: !!opts.show.modal }; }
		else if(typeof opts.show.modal.on === 'undefined') { opts.show.modal.on = TRUE; }
	}
};

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
	show: {
		modal: {
			on: FALSE,
			effect: TRUE,
			blur: TRUE
		}
	}
});/* 
 * BGIFrame adaption (http://plugins.jquery.com/project/bgiframe)
 * Special thanks to Brandon Aaron
 */
function BGIFrame(api)
{
	var self = this,
		elems = api.elements,
		tooltip = elems.tooltip,
		namespace = '.bgiframe-' + api.id,
		events = 'tooltipmove'+namespace+' tooltipshow'+namespace;

	$.extend(self, {
		init: function()
		{
			// Create the BGIFrame element
			elems.bgiframe = $('<iframe class="ui-tooltip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';" ' +
				' style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0);"></iframe>');

			// Append the new element to the tooltip
			elems.bgiframe.appendTo(tooltip);

			// Update BGIFrame on tooltip move
			tooltip.bind(events, self.adjust);
		},

		adjust: function()
		{
			var dimensions = api.get('dimensions'), // Determine current tooltip dimensions
				plugin = api.plugins.tip,
				tip = api.elements.tip,
				tipAdjust, offset;

			// Adjust border offset
			offset = parseInt(tooltip.css('border-left-width'), 10) || 0;
			offset = { left: -offset, top: -offset };

			// Adjust for tips plugin
			if(plugin && tip) {
				tipAdjust = (plugin.corner.precedance === 'x') ? ['width', 'left'] : ['height', 'top'];
				offset[ tipAdjust[1] ] -= tip[ tipAdjust[0] ]();
			}

			// Update bgiframe
			elems.bgiframe.css(offset).css(dimensions);
		},

		destroy: function()
		{
			// Remove iframe
			self.iframe.remove();

			// Remove bound events
			tooltip.unbind(events);
		}
	});

	self.init();
}

PLUGINS.bgiframe = function(api)
{
	var browser = $.browser,
		self = api.plugins.bgiframe;
	
	// Proceed only if the browser is IE6 and offending elements are present
	if(!PLUGINS.bgiframe.needBGI || !(browser.msie && browser.version.charAt(0) === '6')) {
		return FALSE;
	}

	return 'object' === typeof self ? self : (api.plugins.bgiframe = new BGIFrame(api));
};

// Plugin needs to be initialized on render
PLUGINS.bgiframe.initialize = 'render';

PLUGINS.bgiframe.needBGI = $('select, object').length > 0;}(jQuery, window));