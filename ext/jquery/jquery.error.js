/**
 * This is a function that overrides the default $.error method.
 */
(function($){
	var ERROR_DOM_ID	= 'JavaScriptError'+new Date().getTime();

	var errorCache		= window[ERROR_DOM_ID]	= [];
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

		if(window.console){
			console.error(error);

			if(error.stack){
				console.log(error.stack);
			}
		}

		errorCache.push(error);
	};
})(jQuery);