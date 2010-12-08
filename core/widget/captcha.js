/**
 * This is a widget that will display a captcha image.
 */
/*global jQuery: false, cjaf: false*/

(function($, cjaf){
	cjaf.define('core/widget/captcha', [

	],
	function(){
		/**
		 * The default captcha timeout interval.
		 * @type {number}
		 */
		var TIMEOUT_INTERVAL	= (20 * 60 * 1000);

		$.widget('cjaf.core_captcha', {
			options: {
				/**
				 * These are the options that will be passed directly to the 
				 * view template.
				 * @type {Object.<string,*>}
				 */
				"view": {
					/**
					 * These are the attributes that will be applied to the
					 * captcha image.
					 * @type {Object.<string,string>}
					 */
					"image": {
						"css_class": "captcha-image",
						"height": "40px",
						"alt": "Captcha Code",
						"src": ""
					}
				},
				/**
				 * How long in milliseconds before the captcha needs to be
				 * reloaded.
				 *
				 * @type {number}
				 */
				timeout: TIMEOUT_INTERVAL
			},

			_create: function(){
				var self	= this,
					o		= this.options;

				this.element.html(this._view({
						image_class: o.imageClass,
						image_height: o.imageHeight,
						image_alt: o.imageAlt,
						image_src: o.imageSrc
				}));

				this.element.bind('reload', function(){
					self.reload();
				})

				this.timeout(true);
			},
			/**
			 * Re-initialize the captcha element.
			 */
			reload: function(){
				this.element.find('img').reload();
			},
			/**
			 * Reload the captcha element after the timeout time has been reached.
			 *
			 * @param {boolean} 
			 */
			timeout: function(skip_reload){
				var self	= this;

				if(!skip_reload){
					this.reload();
				}
				this.timerId	= setTimeout(function(){
					self.timeout();
				}, this.getTimeoutInterval());
			},
			/**
			 * Get the timeout interval for the captcha reload.
			 * @return {number}
			 */
			getTimeoutInterval: function(){
				return this.options.timeout;
			}
		});
	});
})(jQuery, cjaf);