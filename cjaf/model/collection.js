/**
 * This is an object to hold a collection of model objects.
 */

/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint newcap: false*/

(function ($, cjaf) {
	cjaf.define([
		'lib/underscore',
		'cjaf/model',
		'cjaf/model/response/parser'
	],
	/**
	 * @param {underscore} _
	 * @param {cjaf.Model} Model
	 * @param {ResponseParser} ResponseParser
	 * @return {cjaf.Model.Collection}
	 */
	function (_, Model, ResponseParser) {
		function ModelCollection () {
			
		}
		ModelCollection.prototype	= {
			/**
			 * Thses are the fields that should/must be in a server response
			 * that claims to contain a collection.
			 * @type {Object.<string, *>}
			 */
			fields: {
				'collection': {
					'required': false,
					'alts': ['items']
				},
				'count': {
					'required': false,
					'alts': ['total']
				}
			},
			/**
			 * An intialization function that is meant to be overridden by any
			 * child objects.
			 */
			"init": function () {
				/**
				 * This is the total number of model objects that the service used
				 * to retrieve them says we should have.
				 * @type {number}
				 */
				this.serviceTotal	= null;
				/**
				 * This is the array of model objects.
				 * @type {Array.<Model>}
				 */
				this.models	= [];
			},
			/**
			 * Add the given model object to this collection.
			 * @param {Model} model
			 * @return {ModelCollection}
			 * @throw {Exception}
			 */
			"add": function (model) {
				this.models.push(model);
				return this;
			},
			/**
			 * Get the number of model objects that the service we used to 
			 * retrieve them thinks should be in this collection.
			 * @return {number}
			 */
			"getServiceTotal": function () {
				return this.serviceTotal;
			},
			/**
			 * Make sure that this collection object is not malformed.
			 * @throws {Exception}
			 */
			"validate": function () {
				//Nothing to validate for the base collection.
			},
			/**
			 * Iterate over all the models in the collection yielding each in
			 * turn to the given callback function.
			 * @param {function(number, Model)} callback
			 */
			'each': function (callback) {
				$.each(this.models, callback);
			},
			
			//Integrate some Underscore.js methods.
			
			/**
			 * Produces a new array by passing each model in the collection
			 * to the given transformation function.
			 * @param {function(Model):Model} transform
			 * @param {*} context
			 * @return {Array}
			 */
			'map': function (transform, context) {
				return _.map(this.models, transform, context);
			},
			/**
			 * Return an an array of values for a given model attribute.
			 * @param {string} attribute
			 * @return {Array.<*>}
			 */
			'pluck': function (attribute) {
				return _.pluck(this.models, attribute);
			}
		};
		/**
		 * Get a collection object from the given response object.
		 * @param {Object.<string,*>} response
		 * @param {XMLHttpRequest} XMLHttpRequest
		 * @return {ModelCollection}
		 */
		ModelCollection.wrap	= function (response, XMLHttpRequest) {
			var collection	= new this(),
				parser		= new ResponseParser(collection.fields);
				
			response		= parser.parse(response);
			
			if (response.hasOwnProperty('count')) {
				collection.serviceTotal	= response.count;
			}
			
			return collection;
		};
		
		return ModelCollection;
	});
}(jQuery, cjaf));