(function($){
	var PROP_NAME	= 'stax_translator';
	/**
	 * This is the configuration object. This is where all the translation
	 * settings will be stored.
	 */
	function TranslatorConfig(options){
		/**
		 * This is the key => value mapping for the string translations.
		 *
		 * @type {Object}
		 */
		this.locale	= options['locale'] ? options['locale'] : {};
		/**
		 * This is the message that will be used if an unknown key is presented
		 * for lookup.
		 */
		this.keyNotFoundMessage	= options['keyNotFoundMessage'] ? options['keyNotFoundMessage'] : null;
	}
	$.extend(TranslatorConfig.prototype, {
		/**
		 * This function will look up the given key in the configured locale object.
		 *
		 * @param {string} key
		 * @return {string}
		 */
		getTranslation: function(key){
			var translation	= null;

			//perform any necessary key translation.
			var keyMap	= $.translate["keyMap"];
			if(keyMap.hasOwnProperty(key)){
				key	= keyMap[key];
			}

			if(this.locale[key]){
				translation	= this.locale[key];
			}
			return translation;
		},
		/**
		 * This function will return the "key not found" message.
		 *
		 * @return {string}
		 */
		getKeyNotFoundMessage: function(){
			return this.keyNotFoundMessage;
		}
	});
	/**
	 * This is the plugin instance object, one of the objects will be stored for
	 * every element that this plugin is attached to.  The plugin interface object
	 * will interact with this object to perform the translation tasks.
	 *
	 * @param {string} id
	 * @param {element} target
	 * @param {Object} config
	 */
	function TranslatorInstance(id, target, config){
		/**
		 * @type {string}
		 */
		this.id		= id;
		/**
		 * @type {jQuery}
		 */
		this.target	= target;
		/**
		 * @type {TranslatorConfig}
		 */
		this.config	= config;
	}
	$.extend(TranslatorInstance.prototype, {
		/**
		 * This function will look up the given key in the configured locale
		 * object. If the key is not found then either the configured "not found"
		 * message or the key itself (if no message is configured) will be returned.
		 *
		 * @param {string} key
		 * @return {string}
		 */
		translate: function(key){
			var translation	= this.config.getTranslation(key);

			if(translation == null){
				translation	= this.config.getKeyNotFoundMessage();
			}
			if(translation == null){
				translation	= key;
			}
			return translation;
		}
	});

	/**
	 * This is the jQuery Plugin interface object. ie, this is the Object that
	 * the plugin user will be interacting with.
	 */
	function Translator(){
		/**
		 * @type {Object}
		 */
		this._defaults	= {}
	}
	$.extend(Translator.prototype, {
		/**
		 * Attach the translator to the given element.
		 *
		 * @param {element} target - the target document element.
		 * @param {Object} settings - the user requested settings to use for this instance.
		 */
		_attachTranslator: function(target, settings){
			settings	= $.extend({}, this._defaults, settings);

			var inst	= this._newInstance($(target), settings);

			$.data(target, PROP_NAME, inst);
		},
		/**
		 * Translate the given key for in context of the given element. This function
		 * will accept arguments after the key argument and pass them to the translator
		 * as token replacement arguments.
		 *
		 * @param {element} target - the target document element.
		 * @param {string} key - the translate key.
		 * @return {string}
		 */
		_keyTranslate: function(target, key){
			var translation		= null,
				translator		= this._getInstance(target),
				translatorArgs	= Array.prototype.slice.call(arguments, 1);

			try{
				translation		= translator.translate.apply(translator, translatorArgs);
			} catch(err){
				//errors hidden because we just return the key if we cannot translate.
				$.log(err);
			}

			if($.inArray(key, $.translate['invalidKeys']) >= 0 ){
				translation	= '';

			} else if(!translation){
				translation		= key;
			}
			return translation;
		},
		/**
		 * Create a new translator instance for the given target element.
		 * 
		 * @param {jQuery} target
		 * @param {Object} settings
		 */
		_newInstance: function(target, settings){
			var id		= target[0].id.replace(/([:\[\]\.])/g, '\\\\$1'); // escape jQuery meta chars
			var inst	= new TranslatorInstance(id, target, new TranslatorConfig(settings));

			return inst;
		},
		/**
		 * Get the translator instance for the given target element.
		 *
		 * @param {element} target
		 * @return {TranslatorInstance}
		 * @throws {error} if we cannot find the instance data.
		 */
		_getInstance: function(target){
			try {
				return $.data(target, PROP_NAME);
			} catch(err) {
				throw "Missing instance data for this Translator.";
			}
		}
	});

	$.fn.translate	= function(options){
		if(!$.translate.initialized){
			//do any initialization work here.
			$.translate.initialized	= true;
		}
		var otherArgs	= Array.prototype.slice.call(arguments, 0);

		var translation	= this;

		this.each(function(){
			typeof options	=== 'string' ?
				 translation	= $.translate._keyTranslate.apply($.translate, [this].concat(otherArgs)) :
				 $.translate._attachTranslator(this, options);
		});

		return translation;
	}
	//Standard jQuery extension properties.
	$.translate				= new Translator();  //Singleton instance.
	$.translate.initialized	= false;
	$.translate.uuid		= new Date().getTime();
	$.translate.version		= '0.1';
	/**
	 * This is the key translation map. It is provided as an external property
	 * so that it can be overridden by the user.
	 * @type {Object}
	 */
	$.translate.keyMap		= {}
	/**
	 * This is a list of invalid translation keys.
	 * @type {Array.<string>}
	 */
	$.translate.invalidKeys	= ['[]'];
})(jQuery);