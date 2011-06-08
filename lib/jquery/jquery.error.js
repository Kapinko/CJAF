/**
 * This is a function that overrides the default $.error method.
 */
/*jslint nomen:false*/
/*global jQuery:false,window:false*/
(function($){
	var ERROR_DOM_ID	= 'JavaScriptError' + new Date().getTime(),
	errorCache			= window[ERROR_DOM_ID]	= [],
	/**
	 * Make sure the Error Object exists.
	 */
	Error	= window.Error || function (message) {
		this.message	= message;
	},
	console	= window.console || (function () {
		return {
			error: function (message) {
				alert(message);
			},
			log: function(message) {
				alert(message);
			}
		};
	}());
	/**
	 * An error handling function
	 * @param {string} message - a human readable description of the error.
	 * @param {string} filename - the name of the file the exception occurred in.
	 * @param {string} line_number - the line number where the error occurred.
	 */
	$.error	= function(message, filename, line_number){
		if(filename){
			message	+= "\n in file: "+filename;
		}
		if(line_number){
			message += "["+line_number+"]";
		}

		var error	= new Error(message);
		console.error(error);
		
		if(error.stack){
			console.log(error.stack);
		}
		errorCache.push(error);
	};
})(jQuery);