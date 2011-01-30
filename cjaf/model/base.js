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
		 * This is the default listener configuration that will be
		 * used for all properties that do not have custom getter, setter
		 * or validation properties set.
		 * @type {Object.<string, *>}
		 */
		var DEFAULT_LISTENER_CONFIG	= {
			/**
			 * This function will be used to set the given property on this
			 * model with a value retrieved from an attached element.
			 * @type {function(string, *): cjaf.Model.Base}
			 */
			"setter": function (property_name, value) {
				return this.setProperty(property_name, value);
			},
			/**
			 * This function will be used to retrieve the property value from
			 * this model object so that we can pass along that value to an
			 * attached element
			 * @type {function(string):*}
			 */
			"getter": function (property_name) {
				return this.getProperty(property_name);
			},
			/**
			 * This is a list of validators that should be applied to
			 * an element that we're listening to for this property.
			 * @type {Array.<Validator>}
			 */
			"validators": []
		},
		DEFAULT_PROPERTY_SET_HANDLER	= function (event, value) {
			var self	= $(this),
			myval		= self.val();

			if (value !== myval) {
				self.val(value);
			}
			return false;
		};

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
			 * This is the listener configuration hash for each of this
			 * model's properties.
			 * @type {Object.<string, Object>}
			 */
			this.listenerConfig	= {};

			/**
			 * This is a map of listeners bound to properties of this model.
			 * @type {Object.<string, jQuery>}
			 */
			this.listeners	= {};

			/**
			 * This is the cache object for this model.
			 * @type {Cache}
			 */
			this.cache		= new Cache();

			this.init();
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
				var old_value	= this.getProperty(name);

				this[name]	= value;
				this._notifyChange(name, value, old_value);
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
			 * Listen to the given element and update the given field in
			 * real time when the given element's value changes.
			 * @param {jQuery} element
			 * @param {string} property_name
			 * @param {boolean} listen_only
			 * @param {function()} property_set_handler
			 * @return {cjaf.Model.Base}
			 */
			"bindTo": function (element, property_name, listen_only, property_set_handler) {
				var value		= this.getProperty(property_name),
				setHandler		= property_set_handler || DEFAULT_PROPERTY_SET_HANDLER,
				config			= this.listenerConfig[property_name] || DEFAULT_LISTENER_CONFIG,

				bindSet		= function (element, property_name, getter, handler) {
					element.bind("model.property.set", function (event) {
						var value	= getter(property_name, value);
						handler.call(element, event, value);
						return false;
					});
				},

				bindChange	= function(element, property_name, setter) {
					element.change(function () {
						var value	= element.val();
						setter.call(property_name, value);
						return false;
					});
				},
				current_listeners	= this.listeners[property_name];

				bindSet(element, property_name, $.proxy(config.getter, this), setHandler);
				if (!listen_only) {
					bindChange(element, property_name, $.proxy(config.setter, this));
				}

				if (!current_listeners) {
					this.listeners[property_name]	= element;
				} else {
					this.listeners[property_name]	= current_listeners.add(element);
				}

				this._addValidators(element, config.validators);

				//Notify on add so that the element can display an appropriate
				//response to the bind action.
				this._notifyChange(property_name, value, value);

				return this;
			},
			/**
			 * Notify any listeners that the property value has changed.
			 * @param {string} property_name
			 * @param {*} new_value
			 * @param {*} old_value
			 */
			"_notifyChange": function (property_name, new_value, old_value) {
				var listeners	= this.listeners[property_name];

				if (listeners) {
					listeners.trigger("model.property.set", [new_value, old_value]);
				}
				return this;
			},
			/**
			 * Add a given set of validators to this form element.
			 * @param {jQuery} element
			 * @param {Array.<*>} validators
			 * @return {jQuery}
			 */
			"_addValidators": function (element, validators) {
				if ($.isArray(validators)) {
					for (var i = 0; i < validators.length; i += 1) {
						this._addValidator(element, validators[i].type, validators[i].options);
					}
				}
				return this;
			},
			/**
			 * Add a given validator with the given options to this form element.
			 * @param {jQuery} element
			 * @param {$.validator} validator
			 * @param {Object.<string, *>} options
			 * @return {jQuery}
			 */
			"_addValidator": function (element, validator, options) {
				var elements	= element.find(':input'),
				validators		= cjaf.Validator,
				i, val_class;

				if (element.is('input')) {
					elements.push(element[0]);
				}
				if (typeof options === 'undefined') {
					options	= {};
				}

				for (i = 0; i < elements.length; i += 1) {
					if (typeof validators[validator] === 'function') {
						val_class	= new validators[validator]($(elements[i]), options);
					}
				}
				return this;
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
			 * Set the value of any attached elements.
			 * @,
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
		/**
		 * Set the factory object for the given model model.
		 * @param {cjaf.Model.Base} model
		 * @param {cjaf.Model.Factory} factory
		 * @return {cjaf.Model.Base}
		 */
		Model.Base["setFactory"]	= function (model, factory) {
			var adder	= function (factory) {
				model.getFactory	= function () {
					return factory;
				}
			};
			adder(new factory());

			return this;
		};

		return Model.Base;
	});
}(jQuery, cjaf));