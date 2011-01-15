/**
 * This is the base model instance object.
 */

/** JSLint Declarations*/
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/base', [
		'cjaf/model',
		'cjaf/cache',
		'lib/plugins/String/camelCaseToUnderscore'
	],
	/**
	 * @param {cjaf.Model} Model
	 * @param {cjaf.Cache} Cache
	 * @return {cjaf.Model.Base}
	 */
	function (Model, Cache) {
		/**
		 * @param {string} id
		 * @param {Object.<string,function()>} filters
		 * @return {cjaf.Model.Base}
		 */
		Model.Base	= function (id, filters) {
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

			/**
			 * This is the cache object for this model.
			 * @type {Cache}
			 */
			this.cache		= new Cache();
		};
		Model.Base.prototype	= {
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
				var value	= this[name];
				
				if (value && (typeof apply_filter === 'undefined' || apply_filter)) {
					value	= this._filter(name, value);
				}
				return value;
			},
			/**
			 * Set a property in the cache.
			 * @param {string} name
			 * @param {*} value
			 * @param {number} timeout
			 * @return {cjaf.Model.Base}
			 */
			"setCachedProperty": function (name, value, timeout) {
				this.cache.store(name, value, timeout);
				return this;
			},
			/**
			 * Retrieve a property value from the cache.
			 * @param {string} name
			 * @param {boolean} apply_filter
			 * @return {*}
			 */
			"getCachedProperty": function (name, apply_filter) {
				var value	= this.cache.retrieve(name);

				if (value && (typeof apply_filter === 'undefined' || apply_filter)) {
					value	= this._filter(name, value);
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
			 * Apply a filter to the given stored value.
			 * @param {name}
			 * @param {value}
			 * @return {*} - the filtered value
			 */
			"_filter": function(name, value) {
				var filter	= this.getFilter(name);

				if (typeof filter === 'function') {
					value	= filter(value);
				}

				return value;
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
		};
		
		return Model.Base;
	});
}(jQuery, cjaf));