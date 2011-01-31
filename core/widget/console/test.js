(function($, cjaf){
	cjaf.define('core/widget/console/test', [
		'lib/jquery/jquery.cookie',
		'lib/jquery/jquery.iphone-style-checkboxes'
	],
	function(){
		var DISABLE_CLIENT_SIDE_VALIDATION	= 'stax.disableClientSideValidation',
		LOCALE_COOKIE			= 'cjaf.locale',
		MENU_RENDERER_COOKIE	= "cjaf.menu.renderer";

		$.widget('cjaf.core_console_test', {
			/**
			 * Initialize the test console.
			 */
			_create: function(){
				this.element.html(this._view({}));
				
				this._setUpLanguage();
				this._setUpRenderer();
				this._setUpClientSideValidation();
				this._setUpDialog();
			},
			/**
			 * open the console dialog.
			 */
			toggle: function(){
				var container	= this._getDialog();

				if(container.dialog('isOpen')){
					container.dialog('close');
				} else {
					container.dialog('open');
				}
			},
			/**
			 * Set up the console dialog.
			 */
			_setUpDialog: function(){
				this._getDialog().dialog({
					autoOpen: false,
					modal: true
				});
			},
			_setUpLanguage: function(){
				var selectBox = this._getLanguageSelect();
				selectBox.attr('selected',false);
				selectBox.val($.cookie(LOCALE_COOKIE));
				selectBox.change(function(ev) {
						$.cookie(LOCALE_COOKIE,ev.currentTarget.value);
						window.location.reload();
				});

			},
			_setUpRenderer: function () {
				var select	= this._getRendererSelect();
				select.attr("selected", false);
				select.val($.cookie(MENU_RENDERER_COOKIE));
				select.change(function (event) {
					$.cookie(MENU_RENDERER_COOKIE, select.val());
					window.location.reload();
				});
			},
			/**
			 * Set up the checkbox that controls client side validation.
			 */
			_setUpClientSideValidation: function(){
				var is_enabled	= $.cookie(DISABLE_CLIENT_SIDE_VALIDATION) ? false : true,
					checkbox	= this.element.find('#client-side-validation');

				checkbox.attr('checked', is_enabled);

				checkbox.change(function(){
					var disable	= $(this).is(':checked') ? false: true;

					if(disable){
						if (console) console.log("DISABLING CLIENT SIDE VALIDATION");
					} else {
						if (console) console.log("ENABLING CLIENT SIDE VALIDATION");
					}
					$.cookie(DISABLE_CLIENT_SIDE_VALIDATION, disable ? 'TRUE' : '');
				});

//				this.element.find('#client-side-validation').iphoneStyle();
			},


			_getLanguageSelect: function(){
				return $("#client-language");
			},

			_getRendererSelect: function () {
				return $("#menu-renderer");
			},

			/**
			 * Get the dialog container.
			 * @return {jQuery}
			 */


			_getDialog: function(){
				return $('#container-test-console');
			},
			/**
			 * Toggle a setting checkbox to match the passed in setting.
			 * @param {jQuery} checkbox
			 * @param {boolean} is_enabled
			 */
			_setSettingSwitch: function(checkbox, is_enabled){
				checkbox.attr('checked', is_enabled);
			}
		});
	});
})(jQuery, cjaf);