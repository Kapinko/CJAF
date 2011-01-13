/**
 * This is an object that represents the current HTTP request.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("cjaf/request", [
		'lib/jquery/jquery.ba-bbq'
	],
	function () {
		var Request	= cjaf.namespace("Request", (function () {
			function parse_hash() {
				return $.param.fragment().split("?");
			}

			function get_query_string() {
				return parse_hash()[1];
			}

			function get_page() {
				return parse_hash()[0];
			}

			return {
				/**
				 * Get the value of a parameter with the given name.
				 * @param {string} name
				 * @return {string}
				 */
				"getParam": function (name) {
					return this.getParams()[name];
				},
				/**
				 * Get an object representation of the current request parameters.
				 * @return {Object.<string.*>}
				 */
				"getParams": function () {
					return $.deparam.querystring(get_query_string());
				},
				/**
				 * Get the page identifier from the current request URL.
				 * @return {string}
				 */
				"getPage": function () {
					return get_page();
				}
			}
		}()));

		return Request;
	})
}(jQuery, cjaf));