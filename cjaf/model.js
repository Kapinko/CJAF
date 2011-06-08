/**
 * This module defines all of the necessary name spaces for the
 * CJAF model framework.
 */

//@todo add in property value filters. Thinking this should be done on set.
//@todo determine if we should add in validation. Should this be in the models?

/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define([
		'lib/underscore',
		'cjaf/class',
		'cjaf/cache',
		'cjaf/event'
	],
	/**
	 * @param {underscore} _
	 * @param {Class} Class
	 * @param {Cache} Cache
	 * @param {Events} Events
	 * @return {Model}
	 */
	function (_, Class, Cache, Events) {
		/**
		 * Create a new Model object.
		 * @param {string} id
		 */
		function Model(id) {
			/**
			 * This is the identifier of the model from the web server.
			 * @type {string}
			 */
			this.id	= id || -1;
			/**
			 * This is the client side identifier of this model.
			 * @type {string}
			 */
			this.local_identifier	= _.uniqueId('CJAF.Model.');
			/**
			 * This is the local model cache.
			 * @type {Cache}
			 */
			this.cache	= new Cache();
			
			/**
			 * this is a list of this model's attributes.
			 * @type {Object.<string,*>}
			 */
			this._attributes	= {};
			/**
			 * These are the attributes as they were immediately following the
			 * last change event.
			 * @type {Object.<string,*>}
			 */
			this._previousAttributes	= this._attributes;
			/**
			 * Has this model been modified since the last change event?
			 * @type {boolean}
			 */
			this._changed				= false;
			/**
			 * Are we running in silent mode?
			 * @type {boolean}
			 */
			this._silent				= false;
		}
		Model.prototype	= $.extend(true, Events, {
			/**
			 * This is an initialization method for child classes to use.
			 */
			'init': $.noop,
			/**
			 * Set a property on this object.
			 * @param {string} name
			 * @param {*} value
			 * @return {Model}
			 */
			'setProperty': function (name, value) {
				//@todo add event for new property
				//@todo add event for changed property.
				
				var current	= this.attributes[name];
				
				if (!_.isEqual(current, value)) {
					this.attributes[name]	= value;
					this._changed	= true;
					this.changed(name);
				}
				
				return this;
			},
			/**
			 * Get a property value.
			 * @param {string} name
			 * @return {*}
			 */
			'getProperty': function (name) {
				var value	= this.attributes[name];
				
				return value;
			},
			/**
			 * Set a property into the cache.
			 * @param {string} name
			 * @param {*} value
			 * @param {number} timeout
			 * @return {Model}
			 */
			'setCachedProperty': function (name, value, timeout) {
				this.cache.store(name, value, timeout);
				return this;
			},
			/**
			 * Retrive a property value from the cache.
			 * @param {string}
			 * @return {*}
			 */
			'getCachedProperty': function (name) {
				var value	= this.cache.retrieve(name);
				
				return value;
			},
			/**
			 * Get the server side identifier of this model.
			 * @return {string}
			 */
			'getId': function () {
				return this.id;
			},
			/**
			 * Get the local (client side) identifier of this model.
			 * @return {string}
			 */
			'getLocalId': function () {
				return this.local_identifier;
			},
			/**
			 * Is this a new (client side defined) model?  IE has this model been
			 * saved to the server.
			 * @return {boolean}
			 */
			'isNew': function () {
				return (this.id < 0) ? true : false;
			},
			/**
			 * Determine if the model has changed since the last "changed" event.
			 * If an attribute name is specified, then determine if that attribute
			 * has changed.
			 * @param {string} name
			 */
			'hasChanged': function (name) {
				var changed	= this._changed;
				
				if (changed && name) {
					changed	= this._previousAttributes[name] !== this._attributes[name] ? true : false;
				}
				
				return changed;
			},
			/**
			 * Fire a change event on this object.
			 * @param {string} property_name
			 * @return {Model}
			 */
			'changed': function (property_name) {
				var event	= 'model.changed',
				previous	= this._previousAttributes,
				current		= this._attributes,
				get_event	= function (property) {
					return event + '.' + property;
				};
				
				if (!this.isMuted()) {
					this.trigger(event, current, previous);
					
					if (!property_name) {
						$.each(current, function (name, value) {
							var old	= previous[name];
							
							if (value !== old) {
								this.trigger(get_event(name), value, old);
							}
						});
					} else {
						this.trigger(get_event(property_name), current[property_name], previous[property_name]);
					}
					
					previous		= _.clone(current);
					this._changed	= false;
				}
			},
			/**
			 * Turn off all of the event triggers for this model.
			 * @return {Model}
			 */
			'mute': function () {
				this.is_muted	= true;
				return this;
			},
			/**
			 * Turn on all of the event triggers for this model.
			 * @return {Model}
			 */
			'speak': function () {
				this.is_muted	= false;
				return this;
			},
			/**
			 * Are we running silent?
			 * @return {boolean}
			 */
			'isMuted': function () {
				return this.is_muted ? true : false;
			},
			/**
			 * Return a copy of the model's attributes object.
			 * @return {Object.<string,*>}
			 */
			'toJSON': function () {
				return _.clone(this.attributes);
			},
			/**
			 * Save this model's current state to the server 
			 * @param {function(Model, string, XMLHttpRequest):boolean} success
			 * @param {function(XMLHttpRequest, string, Object):boolean} error
			 */
			'save': function (success, error) {
				var method	= this.isNew() ? '_update' : '_create';
				
				return this[method].apply(this, arguments);
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
				$.error("_update method not implemented");
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
				$.error("_create method not implemented");
			}
		});
		/**
		 * Allow this object to be extended properly.
		 * @param {Object.<string,*>} child
		 * @return {Model}
		 */
		Model.extend	= function (child) {
			return Class.extend(this, child);
		}
		
		return Model;
	});
}(jQuery, cjaf));