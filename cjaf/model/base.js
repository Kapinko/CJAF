/**
 * This is the base model instance object.
 */

/** JSLint Declarations*/
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/base', [
		'lib/plugins/String/camelCaseToUnderscore'
	],
	function () {
		cjaf.Model.Base	= cjaf.Class.extend(
		/** @constructor */
		function (id, filters) {
			/**
			 * @type {number}
			 */
			this.id	= id;
			
			/**
			 * This is a hash of property names mapped to any filters 
			 * necessary.
			 * @type {Object.<string, function()>}
			 */
			this.filters	= (filters) ? filters : {};
		},
		/** @Prototype */
		{
			/**
			 * This is an initialization method for and decendent classes to use.
			 */
			"init": function () {
				
			},
			/**
			 * Set a property on this object.
			 * 
			 * @param {string} name
			 * @param {*} value
			 * @return {cjaf.Model.Base}
			 */
			"setProperty": function (name, value) {
				this[name]	= value;
				return this;
			},
			/**
			 * Get a property value.
			 * @param {string} name
			 * @param {boolean} apply_filter
			 * @return {*}
			 */
			"getProperty": function (name, apply_filter) {
				var filter, value	= this[name];
				
				if (value && (typeof apply_filter === 'undefined' || apply_filter)) {
					filter	= this.getFilter(name);
					
					if (typeof filter === 'function') {
						value	= filter(value);
					}
				}
				return value;
			},
			/**
			 * Get the identifier for this model object.
			 * @return {number}
			 */
			"getId": function () {
				return this.id;
			},
			/**
			 * Save this model's current state to permanent storage on the server.
			 * 
			 * @param {function(Object, string, XMLHttpRequest): boolean} success
			 * @param {function(XMLHttpRequest, string, Object): boolean} error
			 */
			"save": function (success, error) {
				var method;
				
				if (this.getId() > 0) {
					method	= '_update';
				} else {
					method	= '_create';
				}
				return this[method].apply(this, arguments);
			},
			/**
			 * This function will be called when this model object already has
			 * a current representation on the server, ie this model has an 
			 * identifier. Therefore, we just wan to update this object.
			 * 
			 * @param {function(Object, string, XMLHttpRequest): boolean} success
			 * @param {function(XMLHttpRequest, string, Object): boolean} error
			 */
			"_update": function (success, error) {
				throw "_update method not implemented.";
			},
			/**
			 * This function will be called when this model object does not have
			 * a representation on the server, ie this model object does not
			 * have an identifier. In this case we want to create a new object
			 * on the server.
			 * 
			 * @param {function(Object, string, XMLHttpRequest): boolean} success
			 * @param {function(XMLHttpRequest, string, Object): boolean} error
			 */
			"_create": function (success, error) {
				throw "_create method not implemented.";
			},
			/**
			 * This function will return this object in a structure that is 
			 * suitable to send to the server via an AJAX call.
			 * 
			 * @return {Object.<string, *>}
			 */
			"getAjaxStructure": function (object) {
				var subject	= arguments.length > 0 ? object : this;
				return this.filterAjaxDataStructure(subject);
			},
			/**
			 * Filter out nulls and undefined values from the given structure 
			 * so that it is suitable for an AJAX request.
			 * 
			 * @param {Object.<string, *>} subject
			 * @return {Object.<string, *>}
			 */
			"filterAjaxDataStructure": function (subject) {
				var struct	= {}, val, name;
				
				for (name in subject) {
					if (subject.hasOwnProperty(name)) {
						val	= subject[name];
						
						switch (typeof val) {
						case 'number':
						case 'boolean':
						case 'string':
							struct[name]	= val;
							break;

						case 'object':
							if (val !== null) {
								struct[name]	= this.getAjaxStructure(val);
							}
							break;

						case 'function':
						case 'undefined':
							break;
						default:
							break;
						}
					}
				}
				
				return struct;
			},
			/**
			 * Get a filter for the given property name.
			 * @return {function()|null}
			 */
			getFilter: function (name) {
				var filter	= null;
				
				if (this.filters.hasOwnProperty(name)) {
					filter	= this.filters[name];
				}
				
				return filter;
			},
			/**
			 * Add a filter function for the given property.
			 * @param {string} name
			 * @param {function()} filter
			 * @return {cjaf.Model.Base}
			 */
			addFilter: function (name, filter) {
				this.filters[name]	= filter;
				return this;
			}
		});
		
		return cjaf.Model.Base;
	});
}(jQuery, cjaf));