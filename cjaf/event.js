/**
 * This is an event module that can be "mixed-in" with any JavaScript object.
 * @see http://documentcloud.github.com/backbone/
 */
/*jslint nomen:false*/
/*global jQuery:false, define:false*/

(function (define) {
	define([
		'lib/underscore'
	],
	/**
	 * @param {underscore} _
	 * @return {Events}
	 */
	function (_) {
		var Events	= {
			/**
			 * Bind an event, specified by a string name to a callback function.
			 * Passing "all" will bind the callback to all events fired.
			 * @param {string} event
			 * @param {function()} callback
			 * @return {Events}
			 */
			'bind': function (event, callback) {
				if (!this._callbacks) {
					this._callbacks = {};
				}
				
				var list		= this._callbacks[event] || (this._callbacks[event] = []);
				
				list.push(callback);
				return this;
			},
			/**
			 * Remove one or more callbacks for a given event. If `callback` is
			 * null, then all callbacks for the event are removed.  If `event` is
			 * null, then all bound callbacks for all events are removed.
			 * @param {string} event
			 * @param {function()|Array.<Function>} callback
			 * @return {Events}
			 */
			'unbind': function (event, callback) {
				var calls	= this._callbacks;
				
				if (calls) {
					if (!event) {
						calls	= this._callbacks	= {};
					} else if (!callback) {
						calls[event]	= [];
					} else {
						calls[event]	= _.select(calls[event], function (bound) {
							return bound !== callback;
						});
					}
				}
				return this;
			},
			/**
			 * Trigger an event, firing all bound callbacks. Callbacks are passed
			 * the same aguments as `trigger`. Listening for "all" passes the
			 * true event name as the first argument
			 */
			'trigger': function (event) {
				var calls	= this._callbacks,
				index, length, list;
				
				if(calls) {
					list	= calls[event];
					
					if (list) {
						for (index = 0, length = list.length; index < length; index += 1) {
							list[index].apply(this, Array.prototype.slice.call(arguments, 1));
						}
					}
					
					list	= calls['all'];
					
					if (list) {
						for (index = 0, length = list.length; index < length; index += 1) {
							list[index].apply(this, arguments);
						}
					}
				}
				
				return this;
			}
		};
		return Events;
	});
}(define));