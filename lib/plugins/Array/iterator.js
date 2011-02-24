/**
 * This is a plugin for the JavaScript Array object. It provides a way to 
 * retrieve an iterator for the array.  This provides a better interface
 * than the for...in (at least I believe so).
 */
/*global window:false*/
(function (window) {
	/**
	 * @param {Array} subject
	 */
	function Iterator (subject) {
		/**
		 * The array we're going to be iterating through.
		 * @type {Array.<*>}
		 */
		this.subject	= subject;
		/**
		 * The current index.
		 * @type {number}
		 */
		this.current	= 0;
	}
	Iterator.prototype	= {
		/**
		 * Does this iterator have any more items?
		 * @return {boolean}
		 */
		"hasNext": function () {
			return this.current < this.subject.length;
		},
		/**
		 * Get the next item from this array.
		 * @return {*}
		 */
		"getNext": function () {
			var value	= null;

			if (this.hasNext()) {
				value	= this.subject[this.current];
				this.current += 1;
			}

			return value;
		},
		/**
		 * Reset the current index to the array start.
		 * @return {ArrayIterator}
		 */
		"reset": function () {
			this.current	= 0;
			return this;
		}
	}

	return window.Iterator	= Iterator;
}(window));