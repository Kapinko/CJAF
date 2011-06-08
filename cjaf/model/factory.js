/**
 * This is a namespace for the model factory objects.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define([
		'cjaf/class',
		'cjaf/model',
		'cjaf/model/collection',
		'cjaf/model/response/parser'
	],
	/**
	 * @param {Class} Class
	 * @param {Model} Model
	 * @param {ModelCollection} Collection
	 * @param {ResponseParser} ResponseParser
	 * @return {ModelFactory}
	 */
	function (Class, Model, Collection, ResponseParser) {
		function ModelFactory () {
			//Call init() on construction.
			this.init();
			
			/**
			 * This is the parser that we will use to parse an web service 
			 * reponse.
			 * 
			 * We create the parser after the object initialization method is
			 * called because the child object may have added in some fields.
			 * @type {ResponseParser}
			 */
			this.parser	= new ResponseParser(this.getFields());
		}
		ModelFactory.prototype	= {
			/**
			 * This function is provided so that you can perform any necessary
			 * initialization tasks for this factory.
			 */
			'init': $.noop,
			/**
			 * Get the fields that are expected to be in a response object that
			 * supposedly contains a model object.
			 * @return {Object.<string,Object>}
			 */
			'getFields': function () {
				return {
					"id": {
						"required": true
					}
				};
			},
			/**
			 * Get a model object from the given web service response.
			 * @param {Object.<string,*>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {Model}
			 */
			'wrap':  function (response, XMLHttpRequest) {
				var parsed	= this.parser.parse(response);
				return this._wrap(parsed, XMLHttpRequest);
			},
			/**
			 * You must override this function to return a model object.
			 * @param {Object.<string,*>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {Model}
			 */
			'_wrap': function (response, XMLHttpRequest) {
				$.error('You must override the "_wrap" method.');
			},
			/**
			 * Create a collection of objects from the given web service 
			 * response.
			 * @param {Object.<string, *>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @param {string} response_key
			 * @return {Collection}
			 */
			'wrapMany': function (response, XMLHttpRequest, response_key) {
				var collection	= this.getCollectionObject(response, XMLHttpRequest);
				
				if (response_key) {
					response	= response[response_key];
				}
				
				$.each(response, $.proxy(function (index, item) {
					var model	= this.wrap(item);
					collection.add(model);
				}, this));
				
				return collection;
			},
			/**
			 * Create a function that wraps the given function and passes an array
			 * of objects to it. This function is suitable to use as the "success"
			 * parameter of a jQuery.ajax() call.
			 * 
			 * @param {function(Collection, string, XMLHttpRequest)} callback
			 * @param {string} response_key - this is the response object key
			 *						where our model data is located.
			 * @return {function(Object.<string,*>, string, XMLHttpRequest):boolean}
			 */
			'wrapManyCallback': function (callback, response_key) {
				var wrap_callback	= $.proxy(function (response, status, XMLHttpRequest) {
					var collection	= this.wrapMany(response, XMLHttpRequest, response_key);
					collection.validate();
					
					return callback(collection, status, XMLHttpRequest);
				}, this);
				
				return wrap_callback;
			},
			/**
			 * Create a function that wraps the given function and passes a parsed
			 * object to it.  This function is suitable to use as the "success"
			 * parameter of a jQuery.ajax() call.
			 * @param {function(Model, string, XMLHttpRequest)} callback
			 * @param {string} response_key - this is the response object key
			 *						where our model data is located.
			 * @return {function(Object.<string,*>, string, XMLHttpRequest)} 
			 */
			'wrapOneCallback': function (callback, response_key) {
				var wrap_callback	= $.proxy(function (response, status, XMLHttpRequest) {
					if (response.hasOwnProperty(response_key)) {
						response	= response[response_key];
					}
					var model	= this.wrap(response, XMLHttpRequest);
					return callback(model, status, XMLHttpRequest);
				}, this);
				
				return wrap_callback;
			},
			/**
			 * This will parse a collection object from the given response.
			 * @param {Object.<string,*>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {Collection}
			 */
			'getCollectionObject': function (response, XMLHttpRequest) {
				var collection	= Collection.wrap(response, XMLHttpRequest);
				return collection;
			}
		};
		/**
		 * Allow this to be extended.
		 * @param {Object.<string,*>} child
		 * @return {ModelFactory}
		 */
		ModelFactory.extend	= function (child) {
			return Class.extend(this, child);
		}
		
		return ModelFactory;
	});
}(jQuery, cjaf));