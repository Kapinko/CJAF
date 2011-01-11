/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/
(function($, cjaf){
	cjaf.define('cjaf/widget/dispatcher/plugin/redirect_if_logged_in', [
		'cjaf/class',
		'cjaf/widget/dispatcher/plugin',
		'lib/jquery/jquery.auth'
	],
	/**
	 * @param {$.cjaf.Class} Class
	 * @param {DispatcherPlugin} DispatcherPlugin
	 * @return {$.cjaf.Dispatcher.Plugin.RedirectIfLoggedIn}
	 */
	function(Class, DispatcherPlugin){
		var RedirectIfLoggedIn	= cjaf.namespace("Dispatcher.Plugin.RedirectIfLoggedIn",
		Class.extend(DispatcherPlugin, {
			/**
			 * Dispatcher plugin to determine if the user is logged in.
			 * If they are logged in then redirect them to the configured
			 * site.
			 */
			preRender: function(){
				if($.Auth('isLoggedIn')){
					$.Auth('redirect');
					return false;
				}
				return true;
			}
		}));
		return RedirectIfLoggedIn;
	})
})(jQuery, cjaf);