/**
 * This is a basic collection object.
 */

/** JSLint Declarations */
/*global jQuery: false, cjaf: false, window: false*/

(function ($, cjaf, window) {
	cjaf.define('cjaf/collection', [
		'lib/plugins/Array/iterator'
	],
	/**
	 * @return {cjaf.Collection}
	 */
	function () {
		/**
		 * @type {Iterator}
		 */
		var Iterator	= window.Iterator;

		/**
		 * This is an object to store an iterate through a collection of
		 * items.
		 * @param {function():boolean)} item_filter
		 * @constructor
		 */
		cjaf.Collection	= function (item_filter) {
			/**
			 * This is the array of items that we're providing an interface to.
			 * @type {Array.<*>}
			 */
			this.collection	= [];
			/**
			 * This is the array iterator currently in use.
			 * @type {ArrayIterator}
			 */
			this.iterator	= null;
			/**
			 * This is a filter function that will be applied to items as they
			 * are added to this collection.  It must return a boolean value
			 * if the item is allowed to be added or not. If a filter is not
			 * provided then all requested items will be allowed.
			 * @type {function(*):boolean}
			 */
			this.item_filter	= function (item) {
				return true;
			};
				
			if (typeof item_filter === 'function') {
				this.item_filter	= item_filter;
			}
								
			this.init();
		};
		cjaf.Collection.prototype	= {
			/**
			 * An initialization method so that any decendent objects can
			 * perform initialization tasks.
			 */
			"init": function () {
				
			},
			/**
			 * Add an item to this collection
			 * @param {*} item
			 * @return {cjaf.Collection}
			 * @throws {string}
			 */
			"add": function (item) {
				if (!this.item_filter(item)) {
					throw "Unable to add item to collection.";
				}
				
				this.collection.push(item);
				
				if (this.iterator !== null) {
					this.iterator	= null;
				}
				return this;
			},
			/**
			 * Get this collection as an array.
			 * @return {Array.<*>}
			 */
			"getAll": function () {
				return this.collection;
			},
			/**
			 * How many items to we have in this collection?
			 * @return {number}
			 */
			"getCount": function () {
				return this.collection.length;
			},
			/**
			 * Does this collection have an object at the next index?
			 * @return {boolean}
			 */
			"hasNext": function () {
				return this.getIterator().hasNext();
			},
			/**
			 * Get the next item in this collection.
			 * @return {*}
			 */
			"getNext": function () {
				return this.getIterator().getNext();
			},
			/**
			 * Reset the iterator for this collection.
			 * @return {cjaf.Collection}
			 */
			"reset": function () {
				this.iterator	= null;
				return this;
			},
			/**
			 * Get an iterator to iterate through this collection's objects.
			 * @return {ArrayIterator}
			 */
			getIterator: function () {
				if (this.iterator === null) {
					this.iterator	= new Iterator(this.collection);
				}
				return this.iterator;
			},
			/**
			 * Iterate through all of the contained objects and fire off the
			 * given event using the current object as the event data.
			 * @param {string} event_name
			 * @param {jQuery} element.
			 */
			eventIterator: function (event_name, element) {
				if (!element) {
					element	= $(document);
				}

				while (this.hasNext()) {
					element.trigger(event_name, [this.getNext()]);
				}

				this.reset();

				return this;
			}
		};
		
		return cjaf.Collection;
	});
}(jQuery, cjaf, window));