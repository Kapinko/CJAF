/** JSLint Declarations */
/*global jQuery: false, cjaf: false */
/*jslint white:true, browser:true, onevar: false, undef: true, eqeqeq:true, plusplus: true,
bitwise: true, regexp: true, newcap: true, immed: true */

(function ($, cjaf) {
	cjaf.define('cjaf/widget/pluggable', [

	],
	function () {
		/**
		 * This is an abstract widget that provides a plugin framework.
		 */
		$.widget('cjaf.pluggable', {
			/**
			 * @type {Array}
			 */
			plugins: [],
			/**
			 * Get the list of currently registered plugins.
			 *
			 * @return {Array}
			 */
			getPluginList: function () {
				return this.plugins;
			},
			/**
			 * Register a new plugin with this controller
			 *
			 * @param {Object}
			 */
			registerPlugin: function (plugin) {
				this.plugins.push(plugin);
			},
			/**
			 * Call the function identified by the given name on all of the
			 * registered plugins.
			 *
			 * @param {string} method_name
			 * @return {bool}
			 */
			_callMethodOnPlugins: function (method_name) {
				var plugins				= this.getPluginList(),
					continue_execution	= true,
					i					= 0,
					plugin				= null,
					//remove method_name argument
					args				= $.makeArray(arguments);
					
				args.shift();

				//shift ourselves onto the args array so we are the first arg.
				args.unshift(this);

				while (i < plugins.length && continue_execution) {
					plugin	= plugins[i];

					if (typeof plugin[method_name] === 'function') {
						continue_execution	= plugin[method_name].apply(plugin, args);
					}
					i += 1;
				}

				return continue_execution;
			}
		});
	});
}(jQuery, cjaf));