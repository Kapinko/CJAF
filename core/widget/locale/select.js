/**
 * This widget will append a select element to the DOM element it is attached
 * to that will allow a user to change their locale.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false, top:false*/
(function ($, cjaf, location) {
	cjaf.define('core/widget/locale/select', [
		'lib/jquery/jquery.cookie'
	],
	function () {

		function reloadPage() {
			location.reload();
		}

		$.widget('cjaf.core_locale_select', {
			options: {
				/**
				 * This is the identifier that will be used for the locale
				 * select element.
				 */
				'selectId': 'input-core-locale-select',
				/**
				 * This is a function that should return a list of options.
				 */
				'getChoices': function () {
					return [
						{'value': 'en_US', 'display': 'US English'},
						{'value': 'es_ES', 'display': 'Spanish'},
						{'value': 'it-IT', 'display': 'Italian'}
					];
				}
			},
			_create: function () {
				var o	= this.options,
				el		= this.element;

				el.html(this._view({'selectId': o.selectId}));

				this._getSelect().html(this._view('options', {
					'options': o.getChoices()
				}))
				.change($.proxy(this, '_handleUserSelect'));
			},

			_getSelect: function () {
				return this.element.find('#' + this.options.selectId);
			},

			'_handleUserSelect': function () {
				var choice			= $(this._getSelect()).val();
				$.cookie('cjaf.locale', choice);
				reloadPage();
			}
		});
	});
}(jQuery, cjaf, top.window.location));