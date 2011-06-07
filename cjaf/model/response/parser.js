/**
 * This is a parser/sanity checking object for service response objects.
 */

/** JSLint defines */
/*global console: false, jQuery: false, cjaf: false, window: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/response/parser', [
		'cjaf/model/response',
		'cjaf/model/response/field'
	],
	/**
	 * @param {cjaf.Model.Response} Response
	 * @param {cjaf.Model.Response.Field} Field
	 * @return {cjaf.Response.Parser}
	 */
	function (Response, Field) {
		/**
		 * Get a field object from the given definition.
		 * @param {string} field_name
		 * @param {Object.<string,*>} def
		 * @return {Field}
		 */
		function field_from_definition(field_name, def) {
			var required	= def.hasOwnProperty('required') ? def.required : false,
			alternate_names	= def.hasOwnProperty('alts') ? def.alts : [];
			
			return new Field(field_name, required, alternate_names);
		}
		
		/**
		 * This is an object that is used to parse out
		 * information from a service response.
		 * @param {Array.<Object>} fields
		 * @constructor
		 */ 
		Response.Parser	= function (fields) {
			/**
			 * @type {Array.<Field>}
			 */
			this.fields	= [];
			
			this.add(fields);
		};
		Response.Parser.prototype	= {
			/**
			 * This will ensure that the given response object contains the
			 * proper data members to create a model object.  It will return
			 * an object with the proper data members set if the given 
			 * object is valid.
			 * 
			 * @param {Object} response
			 * @return {Object}
			 */
			parse: function (response) {
				var return_obj	= {};
					
				$.each(this.fields, function (trash, field) {
					var field_name	= field.getName(), 
					value			= null;
					
					if (!response.hasownProperty(field_name)) {
						
						$.each(field.getAlternateNames(), function (trash, alt_name) {
							if (response.hasOwnProperty(alt_name)) {
								value	= response[alt_name];
							}
						});
						
					} else {
						value	= response[field_name];
					}
					
					if ((value == null || value === undefined) && field.isRequired()) {
						if (console) {
							console.log('missing field: ' + field_name);
							console.log(response);
						}
						$.error('Response object not valid. Missing "' + field_name + '" field.');
					}
					
					return_obj[field_name]	= value;
				});
				
				return return_obj;
			},
			/**
			 * Allow for the addition of fields.
			 * @param {Array.<Field>|Field}
			 * @return {Response.Parser}
			 */
			'add': function (fields) {
				$.each(fields, $.proxy(function(field_name, definition) {
					var field;
					
					if (definition instanceof Field) {
						this.fields.push(definition);
						
					} else {
						field	= field_from_definition(field_name, definition);
						this.fields.push(field);
					}
				}, this));
				
				return this;
			}
		};
		
		return Response.Parser;
	});
}(jQuery, cjaf));