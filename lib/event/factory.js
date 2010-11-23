/** JSLint Declarations */
/*global document: false, jQuery: false, cjaf: false, alert: false */
/*jslint white:true, browser:true, onevar: false, undef: true, eqeqeq:true, plusplus: true,
bitwise: true, regexp: true, newcap: true, immed: true */

(function ($, cjaf) {
	cjaf.define('lib/event/factory', [
		'lib/event/type/map'
	], function (type_map) {
		/**
		 * @param {Object}
		 */
		var EventFactory	= function (map) {
			this.map	= map;
		};
		EventFactory.prototype	= {
			/**
			 * @type {string}
			 */
			root: 'cjaf',
			/**
			 * Get a an event object by the given widget name and event type..
			 *
			 * @param {string} widget
			 * @param {string} type
			 * @param {Object} data
			 * @return {jQuery.Event}
			 */
			getByWidget: function (widget, type, data) {
				var event		= null;

				type			= this.getTypeByWidget(widget, type);

				if (type) {
					event	= $.Event(type);
				}

				if (data) {
					for (var x in data) {
						if (data.hasOwnProperty(x)) {
							event[x]	= data[x];
						}
					}
				}

				return event;
			},
			/**
			 * Internal function to get a proper widget event string.
			 *
			 * @param {string} widget
			 * @param {string} type
			 * @return {string}
			 */
			getTypeByWidget: function (widget, type) {
				var event_name	= null,
					event_list	= this.map.Widget[widget];

				if (event_list) {
					event_name	= event_list[type];
				} else {
					throw "Could not find a widget by the name: " + widget;
				}
				
				if (event_name) {
					event_name	= [this.root, widget, event_name].join('.');
				}
				return event_name;
			},
			/**
			 * Bind to an event for the given element.
			 *
			 * @param {jQuery} element
			 * @param {string} event_class - the event container name or "widget" name.
			 * @param {string} type
			 * @param {function()} handler
			 * @param {Array} data - any "extra" event data.
			 */
			bindToElement: function (element, event_class, type, handler, data) {
				var event_type	= this.getTypeByClass(event_class, type);

				if (!$.isArray(data)) {
					data	= [];
				}
				$(element).bind(event_type, data, handler);
			},
			/**
			 * Trigger an event on the given element.
			 *
			 * @param {jQuery} element
			 * @param {string} event_class
			 * @param {string} type
			 * @param {Array} data
			 */
			triggerOnElement: function (element, event_class, type, data) {
				var event		= null, trigger_args, jQueryElement;
					
				type			= this.getTypeByClass(event_class, type);

				if (type) {
					event	= $.Event(type);
				}
				if (!event instanceof jQuery.Event) {
					throw "Could not create jQuery event for Event Class: " + event_class + " and type: " + type;
				}
				//Get the data arguments
				trigger_args	= Array.prototype.slice.call(arguments, 3);
				trigger_args.unshift(event);

				jQueryElement	= $(element);
				jQueryElement.trigger.apply(jQueryElement, trigger_args);
			},
			/**
			 * Internal function to get a proper widget event string.
			 *
			 * @param {string} event_class
			 * @param {string} type
			 * @return {string}
			 */
			getTypeByClass: function (event_class, type) {
				var event_name	= null,
					event_list	= this.map[event_class];

				if (event_list) { 
					event_name	= event_list[type];
				} else {
					throw "Could not find a widget by the name: " + event_class;
				}

				if (event_name) {
					event_name	= [this.root, event_class, event_name].join('_');
				}
				return event_name;
			}
		};
		cjaf.EventFactory	=  new EventFactory(type_map);

		return cjaf.EventFactory;
	});
}(jQuery, cjaf));