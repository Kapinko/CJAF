/** JSLint Declarations */
/*global jQuery: false, window: false*/
(function ($, window) {
	/**
	 * Is the pnotify plugin available?
	 *
	 * @type {boolean}
	 */
	var	hasPNotify		= (typeof $.pnotify === 'function') ? true : false,
	
	/**
	 * An accessor for the window.console method.
	 * @type {*}
	 */
	console	= window.console,

	/**
	 * Display a notification if the pnotify notification plugin is available.
	 *
	 * @param {string} message
	 * @param {string} title
	 */
	growl			= function (message, title, opts) {
		if(hasPNotify){
			var options	= {
				pnotify_history: false,
				pnotify_delay: 4000,
				pnotify_hide: false
			};
			$.extend(options, opts, {
				pnotify_title: title,
				pnotify_text: message
			});
			$.pnotify(options);
		} else {
			console.log(message);
		}
	};

	//Hijack the default alert function.
	if(hasPNotify){
		if(!window._alert){
			window._alert	= window.alert;
			window.alert	= function(message){
				growl(message, 'Alert');
			};
		}
	}
	/**
	 * Add a log function to the jQuery object.
	 *
	 * @param {string} message
	 * @param {string} log_level
	 */
	$.log	= function(message, log_level){
		if(!log_level){
			log_level	= 'log';
		}

		if(console){
			switch(log_level){
				case 'debug':
					console.debug(message);
					break;
				case 'notify':
					growl(message, 'Notification', {pnotify_hide: true});
					break;
				case 'error':
					growl(message, 'ERROR', {pnotify_type: 'error'});
					break;
				case 'log':
				default:
					console.log(message);
					break;
			}
		} else {
			//hmmm... should add some sort of error div here.
		}
	};
	/**
	 * Send a notification message to the user.
	 * @param {string} message
	 */
	$.logNotify	= function(message){
		$.log(message, 'notify');
	},
	/**
	 * Send an error message to the user.
	 * @param {string} message
	 */
	$.logError	= function(message){
		$.log(message, 'error');
	},
	/**
	 * Send a debug message to the console.
	 * @param {string} message
	 */
	$.logDebug	= function(message){
		$.log(message, 'debug');
	}
}(jQuery, window));
