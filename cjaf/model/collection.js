/**
 * This is an object to hold a collection of model objects.
 */

/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/
/*jslint newcap: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/collection', [
		'cjaf/Class',
		'cjaf/collection',
		'cjaf/model',
		'cjaf/model/repsonse/parser'
	],
	/**
	 * @param {cjaf.Class} Class
	 * @param {cjaf.Collection} Collection
	 * @param {cjaf.Model} Model
	 * @param {cjaf.Model.Response.Parser} ResponseParser
	 * @return {cjaf.Model.Collection}
	 */
	function (Class, Collection, Model, ResponseParser) {
		Model.Collection	= Class.extend(Collection, {
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
				 * This is the prototype object for all the objects that we 
				 * are collecting.
				 * @type {Object}
				 */
				this.containedPrototype	= null;
			},
			/**
			 * Add the given model object to this collection.
			 * @param {cjaf.Model.Abstract} model
			 * @return {cjaf.Model.Collection.Base}
			 * @throw {Exception}
			 */
			"add": function (model) {
				if (this.containedPrototype === null) {
					this.containedPrototype	= model;
					
				} else if (!(model instanceof this.containedPrototype)) {
					$.error('Given model is not an instance of ' + 
						this.containedPrototype);
				}
				
				return Collection.prototype.add.apply(this, arguments);
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
			}
		});
		
		/**
		 * Get a collection object from the given response object.
		 * @param {Object.<string,*>} response
		 * @param {XMLHttpRequest} XMLHttpRequest
		 * @return {cjaf.Model.Collection}
		 */
		Model.Collection.wrap	= function (response, XMLHttpRequest) {
			var collection	= new this(),
				parser		= new ResponseParser(collection.fields);
				
			response		= parser.parse(response);
			
			if (response.hasOwnProperty('count')) {
				collection.serviceTotal	= response.count;
			}
			
			return collection;
		};
		
		return Model.Collection;
	});
}(jQuery, cjaf));