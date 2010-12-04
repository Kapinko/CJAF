/**
 * This is a parser/sanity checking object for service response objects.
 */

/** JSLint defines */
/*global console: false, jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/model/response/parser', [
		'cjaf/collection',
		'cjaf/model/response',
		'cjaf/model/response/field'
	],
	/**
	 * @param {cjaf.Collection} Collection
	 * @param {cjaf.Model.Response} Response
	 * @param {cjaf.Model.Response.Field} Field
	 * @return {cjaf.Response.Parser}
	 */
	function (Collection, Response, Field) {
		/**
		 * This is an object that is used to parse out
		 * information from a service response.
		 * @param {Array.<Object>} fields
		 * @constructor
		 */ 
		Response.Parser	= function (fields) {
			var field_name, field_rec, field_obj, required, alts;
			
			this.fields	= null;
			
			if (!(fields instanceof Collection)) {
				this.fields	= new Collection();
				
				for (field_name in fields) {
					if (fields.hasOwnProperty(field_name)) {
						field_rec	= fields[field_name];
						
						if (!(field_rec instanceof Field)) {
							required	= field_rec.hasOwnProperty('required') ? field_rec.required : false;
							alts		= field_rec.hasOwnProperty('alts') ? field_rec.alts : [];
							
							field_obj	= new Field(field_name, required, alts);
						} else {
							field_obj	= field_rec;
						}
						
						this.fields.add(field_obj);
					}
				}
			} else {
				this.fields	= fields;
			}
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
				var field_list	= this.fields,
					return_obj	= {},
					field, value, required, alt, alt_iter, has_field;
					
				while (field_list.hasNext()) {
					value	= null;
					field	= field_list.getNext();
					
					if (!response.hasOwnProperty(field.getName())) {
						alt_iter	= field.getAlternateNames().getIter();
						
						while (alt_iter.hasNext()) {
							alt	= alt_iter.getNext();
							
							if (response.hasOwnProperty(alt)) {
								value	= response[alt];
							}
						}
					} else {
						value	= response[field.getName()];
					}
					
					if (!value && field.isRequired()) {
						if (console) {
							console.log('missing field: ' + field);
							console.log(response);
						}
						$.error('Response object not valid. Missing "' +
									field + '" field.');
					}
					
					return_obj[field.getName()]	= value;
				}
				
				return return_obj;
			}
		};
		
		return Response.Parser;
	});
}(jQuery, cjaf));