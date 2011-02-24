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
						{'value': '', 'display': 'US English'},
						{'value': 'af', 'display': 'Afrikaans'},
						{'value': 'sq', 'display': 'Albanian'},
						{'value': 'ar', 'display': 'Arabic'},
						{'value': 'be', 'display': 'Belarusian'},
						{'value': 'bg', 'display': 'Bulgarian'},
						{'value': 'ca', 'display': 'Catalan'},
						{'value': 'hr', 'display': 'Crotian'},
						{'value': 'cs', 'display': 'Czech'},
						{'value': 'da', 'display': 'Danish'},
						{'value': 'nl', 'display': 'Dutch'},
						{'value': 'et', 'display': 'Estonian'},
						{'value': 'tl', 'display': 'Filipino'},
						{'value': 'fi', 'display': 'Finnish'},
						{'value': 'ft', 'display': 'French'},
						{'value': 'gl', 'display': 'Galican'},
						{'value': 'de', 'display': 'German'},
						{'value': 'el', 'display': 'Greek'},
						{'value': 'ht', 'display': 'Hatian Creole'},
						{'value': 'iw', 'display': 'Hebrew'},
						{'value': 'hi', 'display': 'Hindi'},
						{'value': 'hu', 'display': 'Hungarian'},
						{'value': 'is', 'display': 'Icelandic'},
						{'value': 'id', 'display': 'Indonesian'},
						{'value': 'ga', 'display': 'Irish'},
						{'value': 'it', 'display': 'Italian'},
						{'value': 'ja', 'display': 'Japanese'},
						{'value': 'lv', 'display': 'Latvian'},
						{'value': 'lt', 'display': 'Lithuanian'},
						{'value': 'mk', 'display': 'Macedonian'},
						{'value': 'ms', 'display': 'Malay'},
						{'value': 'mt', 'display': 'Maltese'},
						{'value': 'no', 'display': 'Norwegian'},
						{'value': 'fa', 'display': 'Persian'},
						{'value': 'pl', 'display': 'Polish'},
						{'value': 'pt', 'display': 'Portuguese'},
						{'value': 'ro', 'display': 'Romanian'},
						{'value': 'ru', 'display': 'Russian'},
						{'value': 'sr', 'display': 'Serbian'},
						{'value': 'sk', 'display': 'Slovak'},
						{'value': 'sl', 'display': 'Slovenian'},
						{'value': 'es', 'display': 'Spanish'},
						{'value': 'sw', 'display': 'Swahili'},
						{'value': 'sv', 'display': 'Sweedish'},
						{'value': 'th', 'display': 'Thai'},
						{'value': 'tr', 'display': 'Turkish'},
						{'value': 'uk', 'display': 'Ukranian'},
						{'value': 'cy', 'display': 'Vietnamese'},
						{'value': 'yi', 'display': 'Yiddish'}
					];
				}
			},
			_create: function () {
				var o	= this.options,
				el		= this.element,
				locale	= $.cookie('cjaf.locale');

				el.html(this._view({'selectId': o.selectId}));

				this._getSelect().html(this._view('options', {
					'options': o.getChoices()
				}))
				.change($.proxy(this, '_handleUserSelect'));

				if (locale) {
					this._getSelect().val(locale);
				}
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