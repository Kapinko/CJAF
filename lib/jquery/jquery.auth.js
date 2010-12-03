(function($){
	/**
	 * The default cache timeout. (30 seconds, in milliseconds.
	 *
	 * @type {number}
	 */
	var DEFAULT_CACHE_TIMEOUT	= (30 * 1000);

	/**
	 * This is the Authentication configuration object.
	 *
	 * @param {Object} options
	 */
	var AuthConfig	= function(options){
		/**
		 * Default configuration options.
		 */
		var config	= {
			/**
			 * How long before our cache expires.
			 * @type {number}
			 */
			cacheTimeout: DEFAULT_CACHE_TIMEOUT,
			/**
			 * The URL to hit when we want to log a user in.
			 * @type {string}
			 */
			loginUrl: '/LOGIN',
			/**
			 * The URL to hit when we want to log a user out.
			 * @type {string}
			 */
			logoutUrl: '/SESSION/0?_method=DELETE',
			/**
			 * The URL to hit when we want to get user information. eg. Is there
			 * a user logged in?.
			 * @type {string}
			 */
			queryUrl: '/LOGIN/query',
			/**
			 * The captcha image identifier.
			 * @type {string}
			 */
			captchaImageSelector: '.captcha-image',
			/**
			 * Redirect the user.
			 * @type {function()}
			 */
			userRedirect: null,
			/**
			 * A function that will return a timestamp.
			 * @type {function(): number}
			 */
			timestampFunction: null,
			/**
			 * A function to parse the login query response.
			 * @type {function(Object): jQuery.Auth.User}
			 */
			queryResponseParser: null
		}
		if(options) $.extend(config, options);
		this.config	= config;

		if(this.config.timestampFunction !== 'function'){
			this.config.timestampFunction	= function(){
				return new Date().getTime();
			};
		}

		if(this.config.queryResponseParser !== 'function'){
			this.config.queryResponseParser	= function(response){
				var result		= null;

				if(response && response.login_information){
					var info	= response.login_information;

					result	= new $.Auth.User(
						info.application_id,
						info.user_id,
						info.server_time * 1000,
						info.is_master,
						response.logged_in
					);
				}
				return result;
			};
		}
		
		if(typeof this.config.userRedirect !== 'function'){
			this.config.userRedirect	= function(){
				if($.Auth('isLoggedIn')){
					window.location	= '/index.html';
				} else {
					window.location = '/login.html';
				}
			};
		}
	}
	AuthConfig.prototype	= {
		/**
		 * @return {number}
		 */
		getCacheTimeout: function(){
			return this.config.cacheTimeout;
		},
		/**
		 * @return {string}
		 */
		getLoginUrl: function(){
			return this.config.loginUrl;
		},
		/**
		 * @return {string}
		 */
		getLogoutUrl: function(){
			return this.config.logoutUrl;
		},
		/**
		 * @return {string}
		 */
		getQueryUrl: function(){
			return this.config.queryUrl;
		},
		/**
		 * @return {number}
		 */
		getTimestamp: function(){
			return this.config.timestampFunction();
		},
		/**
		 * @return {jQuery}
		 */
		getCaptchaImage: function(){
			return $(this.config.captchaImageSelector);
		},
		/**
		 * @param {Object} response
		 * @return {jQuery.Auth.User}
		 */
		parseQueryResponse: function(response){
			return this.config.queryResponseParser(response);
		},
		/**
		 * Redirect the user appropriately.
		 */
		redirect: function(){
			this.config.userRedirect();
		}
	};

	/**
	 * @param {Object} options
	 */
	var AuthInstance	= function (options){
		/**
		 * @type {AuthConfig}
		 */
		this.config		= new AuthConfig(options);
		/**
		 * The cache expiry timestamp.
		 * @type {number}
		 */
		this.cacheTime	= 0;
		/**
		 * The currently logged in user.
		 * @type {jQuery.Auth.User}
		 */
		this.user		= null;
	}
	AuthInstance.prototype = {
		/**
		 * Function to log a user in.
		 *
		 * @param {jQuery.Auth.Credentials} credentials
		 * @param {function(Object, string, XMLHttpRequest)} success
		 * @param {function(XMLHttpRequest, string, Object)} error
		 */
		'_login': function(credentials, success, error){
			var captcha_image	= this.config.getCaptchaImage();

			$.ajax({
				url: this.config.getLoginUrl(),
				type: 'POST',
				dataType: 'json',
				data: {
					username: credentials.getUsername(),
					password: credentials.getPassword(),
					captcha: credentials.getCaptcha()
				},
				success: success,
				error: error,
				complete: function(){
					captcha_image.trigger('reload');
				}
			})
		},
		/**
		 * Function to log a user out.
		 * @param {function} success
		 * @param {function} error
		 * @param {boolean} asynchronous
		 */
		'_logout': function(success, error, asynchronous){
			this.resetCache();

			if(typeof error !== 'function'){
				error	= function(){
					alert('Unable to log out.');
				};
			}
			if(typeof asynchronous === 'undefined'){
				asynchronous	= true;
			}
			$.ajax({
				url: this.config.getLogoutUrl(),
				type: 'POST',
				dataType: 'json',
				data: {},
				success: success,
				async: asynchronous ? true : false,
				error: error
			});
		},
		/**
		 * Is there a user currently logged in?
		 */
		'_isLoggedIn': function(){
			var self	= this;
			
			if(this.hasCacheExpired()){
				var	parser	= function(){
					return self.config.parseQueryResponse.apply(self.config, arguments);
				}
				$.ajax({
					url: this.config.getQueryUrl(),
					type: 'GET',
					async: false,
					error: function(XMLHttpResponse, textStatus, exception){
						var status	= XMLHttpResponse.status;
						switch(status){
							case 494:{
								var response	= $.parseJSON(XMLHttpResponse.responseText);
								self.user	= parser(response);
								//window.location	= '#kba-reset';
								break;
							}
							default: {
								self.resetCache();
							}
						}
					},
					success: function(response, textStatus, XMLHttpResponse){
						self.user		= parser(response);
						self.cacheTime	= self.config.getTimestamp() + self.config.getCacheTimeout();
					}
				});
			}
			return self.user && self.user.isLoggedIn();
		},
		/**
		 * Redirect the user to the proper site.
		 */
		'_redirect': function(){
			this.config.redirect();
		},
		/**
		 * Get the currently logged in user.
		 * @return {jQuery.Auth.User}
		 */
		'_getUser': function(){
			return this.user;
		},
		/**
		 * Has the cache expired?
		 * @return {boolean}
		 */
		hasCacheExpired: function(){
			return (this.cacheTime < this.config.getTimestamp()) ? true : false;
		},
		/**
		 * Reset the cache.
		 */
		resetCache: function(){
			this.cacheTime	= 0;
		}

	};

	$.Auth = function(options){
		if(!$.Auth.intialized){
			//Do any intialization work here.
			$.Auth.intialized	= true;
		}
		var otherArgs	= Array.prototype.slice.call(arguments,1);
		
		return typeof options === 'string' ?
			$.Auth.instance['_'+options].apply($.Auth.instance, otherArgs) :
			$.Auth.instance	= new AuthInstance(options);
	}
	/* Standard jQuery Plugin attributes */
	$.Auth.instance		= new AuthInstance(); //singleton instance.
	$.Auth.initialized	= false;
	$.Auth.uuid			= new Date().getTime();
	$.Auth.version		= '0.1';

	/**
	 * Object to store a set of authentication credentials.
	 *
	 * @param {string} username
	 * @param {string} password
	 * @param {string} captcha
	 */
	$.Auth.Credentials = function(username, password, captcha){
		/**
		 * The stored username.
		 * @type {string}
		 */
		this.username	= username;
		/**
		 * The stored password.
		 * @type {string}
		 */
		this.password	= password;
		/**
		 * The stored captcha.
		 * @type {string}
		 */
		this.captcha	= captcha;
	}
	$.Auth.Credentials.prototype	= {
		/**
		 * Get the stored username. If a cookie name is provided then the 
		 * username will be loaded from the cookie represented by the given name.
		 * @param {string} cookie_name
		 * @return {string}
		 */
		'getUsername': function(cookie_name){
			if(cookie_name){
				this.username	= $.cookie(cookie_name);
			}
			return this.username;
		},
		/**
		 * Get the stored password.
		 * @return {string}
		 */
		'getPassword': function(){
			return this.password;
		},
		/**
		 * Get the stored captcha value.
		 * @return {string}
		 */
		'getCaptcha': function(){
			return this.captcha;
		},
		/**
		 * Set the stored user name value.
		 * @param {string} username
		 * @param {string} cookie_name
		 * @return {jQuery.Auth.Credentials}
		 */
		'setUsername': function(username, cookie_name){
			this.username	= username;

			if(cookie_name){
				$.cookie(cookie_name, username);
			}
			return this;
		},
		/**
		 * Set the stored password value.
		 * @param {string} password
		 * @return {jQuery.Auth.Credentials}
		 */
		'setPassword': function(password){
			this.password	= password;
			return this;
		},
		/**
		 * Set the stored captcha value.
		 * @param {string} captcha
		 * @return {jQuery.Auth.Credentials}
		 */
		'setCaptcha': function(captcha){
			this.captcha	= captcha;
			return this;
		}
	}

	/**
	 * @param {string} application_id
	 * @param {string} user_id
	 * @param {number} server_time
	 * @param {boolean} is_master
	 * @param {boolean} is_logged_in
	 */
	$.Auth.User	= function(application_id, user_id, server_time, is_master, is_logged_in){
		/**
		 * The user's application identifier.
		 * @type {string}
		 */
		this.appId	= application_id ? application_id : -1
		/**
		 * The user's identifier.
		 * @type {string}
		 */
		this.userId		= user_id ? user_id : -1;
		/**
		 * The server suggested cache timestamp.
		 * @type {number}
		 */
		this.serverTime	= server_time ? server_time : new Date().getTime();

		if(is_master === 'undefined'){
			is_master	= false;
		}
		/**
		 * Is this a master/primary account?
		 * @type {boolean}
		 */
		this.isMasterFlag	= is_master;
		/**
		 * Is this user logged in?
		 * @type {boolean}
		 */
		this.isLoggedInFlag	= is_logged_in;
	}
	$.Auth.User.prototype	= {
		/**
		 * Get the user's application identifier.
		 *
		 * @return {string}
		 */
		'getApplicationId': function(){
			return this.appId;
		},
		/**
		 * Get the user's identifier.
		 *
		 * @return {string}
		 */
		'getUserId': function(){
			return this.userId;
		},
		/**
		 * Get the servers suggested cache timestamp.
		 *
		 * @return {number}
		 */
		'getServerTime': function(){
			return this.serverTime;
		},
		/**
		 * Is this a master account?
		 * @return {boolean}
		 */
		'isMaster': function(){
			return this.isMasterFlag ? true : false;
		},
		/**
		 * Is this user logged in?
		 * @return {boolean}
		 */
		'isLoggedIn': function(){
			return this.isLoggedInFlag ? true : false;
		}
	}
})(jQuery);