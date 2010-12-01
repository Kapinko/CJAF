/**
 * This is the base factory for Model factories.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/factory/abstract', [
		'cjaf/model/factory',
		'cjaf/model/response/parser',
		'cjaf/model/collection',
		'lib/plugins/String/camelCaseToUnderscore',
	],
	/**
	 * @param {cjaf.Model.Factory} Factory
	 * @param {cjaf.Model.Response.Parser} ResponseParser
	 * @param {cjaf.Model.Collection} Collection
	 * @return {cjaf.Model.Factory.Abstract}
	 */
	function (Factory, ResponseParser, Collection) {
		/**
		 * @constructor
		 */
		Factory.Abstract	= function() {
			//Call init on construction.
			this.init();
			
			/**
			 * This is the parser that we will use to parse any service.
			 * 
			 * We create the parser after the object initialization 
			 * method has been called because the child object may 
			 * have added in some fields.
			 * @type {ResponseParser}
			 */
			this.parser	= new ResponseParser(this.fields)
		};
		Factory.Abstract.prototype = {
			"fields": {
				'id': {
					'required': true
				}
			},
			/**
			 * This function is provided so that you can perform any necessary
			 * initialization tasks for this factory.
			 */
			"init": function () {},
			/**
			 * Get a model object from the given server response.
			 * 
			 * @param {Object.<string, *>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {cjaf.Model.Abstract}
			 */
			"wrap": function (response, XMLHttpRequest) {
				$.error('You must override the "wrap" method.');
			},
			/**
			 * Create a collection of account objects from the given API
			 * call return
			 * 
			 * @param {Object.<string, *>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @param {string} response_key
			 * @return {AbstractCollection}
			 */
			"wrapMany": function (response, XMLHttpRequest, response_key) {
				var collection	= this.getCollectionObject(response, XMLHttpRequest),
				response_index, model;

				if (response_key) {
					response	= response[response_key];
				}

				for (response_index in response) {
					if (response.hasOwnProperty(response_index)) {
						model	= this.wrap(response.response_index);
						collection.add(model);
					}
					
				}

				return collection;
			},
			/**
			 * Create a function that wraps the given function and passes
			 * an array of objects to it. This function is suitable to use
			 * as the "success" parameter of a jQuery.ajax() call.
			 * 
			 * @param {function(Object, XMLHttpRequest)} callback
			 * @param {string} response_key - this is the response object 
			 *					key where our data is located.
			 *	@return {function()}
			 */
			"wrapManyCallback": function (callback, response_key) {
				var self, wrap_callback;

				self	= this;

				wrap_callback	= function (response, status, XMLHttpRequest) {
					var collection	= self.wrapMany(response, XMLHttpRequest, response_key);

					collection.validate();

					return callback(collection, status, XMLHttpRequest);
				};

				return wrap_callback;
			},
			/**
			 * Create a function that wraps the given function and passes
			 * a parsed object to it.  This function is suitable to use at
			 * the "success" parameter of a jQuery.ajax() call.
			 * 
			 * @param {function(Object, XMLHttpRequest)} callback
			 * @param {string} responsed_key - this is the response object
			 *					key where our data is located.
			 * return {function(Object, string, XMLHttpRequest):Object}
			 */
			"wrapOneCallback": function (callback, response_key) {
				var self, wrap_callback;

				self	= this;

				wrap_callback	= function (response, status, XMLHttpRequest) {
					if (response[response_key]) {
						response	= response[response_key];
					}
					var object	= self.wrap(response, XMLHttpRequest);
					return callback(object, status, XMLHttpRequest);
				};

				return wrap_callback;
			},
			/**
			 * This will parse a collection object from the given response.
			 * @param {Object.<string,*>} response
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {cjaf.Model.Collection.Abstract}
			 */
			"getCollectionObject": function (response, XMLHttpRequest) {
				var collection	= Collection.wrap(response, XMLHttpRequest);
				return collection;
			}
		};
		
		return Factory.Abstract;
	});
	
}(jQuery, cjaf));