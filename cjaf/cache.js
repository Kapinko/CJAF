/**
 * This is a general purpose cache object.
 */
/*jslint nomen:false*/
/*global jQuery:false,cjaf:false*/

(function ($, cjaf) {
	cjaf.define("cjaf/cache", [

	],
	/**
	 * @return {Cache}
	 */
	function () {
		var DEFAULT_CACHE_TIME	= (30 * 1000), //30 seconds in milliseconds.
		Cache	= function (timeout) {
			if (!timeout) {
				timeout	= DEFAULT_CACHE_TIME;
			}

			this.defaultTimeout	= timeout;
			/**
			 * This is the cache store
			 * @type {Object.<string,*>}
			 */
			this.walmart	= {};
		}
		Cache.prototype	= {
			/**
			 * @param {string} name
			 * @param {*} value
			 * @param {number} timeout - a custom timeout value.
			 * @return {Cache}
			 */
			"store": function (name, value, timeout) {
				if (!timeout) {
					timeout	= this.defaultTimeout;
				}

				this.walmart[name]	= {
					"value": value,
					"timeout": timeout + this._getTimestamp()
				};
			},
			/**
			 * Get a stored value
			 * @param {string} name
			 * @return {*}
			 */
			"retrieve": function (name) {
				var store	= this.walmart[name],
				value = null;

				if (store && !this._hasExpired(store)) {
					value	= store.value;
				}

				return value;
			},

			_getTimestamp: function () {
				return new Date().getTime();
			},

			_hasExpired: function (store) {
				return (store.timeout < this._getTimestamp()) ? true : false;
			}
		}

		return Cache;
	});
}(jQuery, cjaf));