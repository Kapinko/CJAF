/**
 * A mix-in that allows you to add filters to any object.
 */
/*jslint nomen:false*/
/*global jQuery:false, define:false*/

(function (define) {
	define([
		'lib/underscore'
	],
	/**
	 * @param {underscore} _
	 * @return {Filters}
	 */
	function (_) {
		var Filters	= {
			/**
			 * Set all of the filters on this model
			 * @param {Object.<string,function()>} config
			 * @return {Model}
			 */
			'setFilters': function (config) {
				this._filters	= config;
				return this;
			},
			/**
			 * Add a filter for a given property name. If you would like the 
			 * filter to be applied to all properties then use the special "all"
			 * name.
			 * @param {string} name
			 * @param {function()} filter
			 * @return {Model}
			 */
			'addFilter': function (name, filter) {
				if (!this._filters) {
					this._filters	= {};
				}
				var list	= this._filters[name] || (this._filters[name]	= []);
				list.push(filter);
				
				return this;
			},
			/**
			 * Remove a filter or filters from this model.
			 * @param {string} name
			 * @param {function()} filter
			 * @return {Model}
			 */
			'removeFilter': function (name, filter) {
				var filters	= this._filters;
				
				if (filters) {
					if (!name) {
						filters	= {};
					} else if (!filter) {
						filters[name]	= [];
					} else {
						filters[name]	= _.select(filters[name], function (bound) {
							return bound !== filter;
						});
					}
				}
				return this;
			},
			/**
			 * Run the filter for the given property.
			 * @param {string} name - the property name.
			 * @param {*} value - the value to filter.
			 * @return {*} - the filtered value.
			 */
			'filter': function (name, value) {
				var filters			= this._filters,
				index, length, list;
				
				if (filters) {
					list	= filters[name];
					
					if (list) {
						for (index = 0, length = list.length; index < length; index += 1) {
							value	= list[index](value);
						}
					}
					
					list	= filters['all'];
					
					if (list) {
						for (index = 0, length = list.length; index < length; index += 1) {
							value	= list[index](value);
						}
					}
				}
				
				return value;
			}
		};
		return Filters;
	});
}(define));