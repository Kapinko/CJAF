/**
 * This is a response object field specification.
 */

/** JSLint declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/response/field', [
		'cjaf/model/response'
	],
	/**
	 * @param {cjaf.Model.Response} Response
	 * @return {cjaf.Model.Response.Field}
	 */
	function (Response) {
		/**
		 * This is a represenation of a service response field.
		 * @param {string} name
		 * @param {boolean} is_required
		 * @param {Array.<string>} alt_names 
		 * @constructor 
		 */
		Response.Field	= function (name, is_required, alt_names) {
			/**
			 * This is the field name that the CJAF model object will expect.
			 * @type {string}
			 */
			this.name	= name;
			/**
			 * Is this a required field?
			 * @type {boolean}
			 */
			this.required	= is_required ? true : false;
			/**
			 * This is a list of alternate names for this field.  This is
			 * used to check the service response in case the name does not
			 * exist in the response. This way a model object can deal with 
			 * non-uniform services.
			 * @type {Array.<string>}
			 */
			this.alt_names	= alt_names;
		};
		$.extend(Response.Field.prototype, {
			/**
			 * Get the name of this field.
			 * @return {string}
			 */
			"getName": function () {
				return this.name;
			},
			/**
			 * Is this a required field?
			 * @return {boolean}
			 */
			"isRequired": function () {
				return this.required ? true : false;
			},
			/**
			 * Get all of the alternate names.
			 * @return {Array.<string>}
			 */
			"getAlternateNames": function () {
				return this.alt_names;
			}
		});
		
		return Response.Field;
	});
}(jQuery, cjaf));