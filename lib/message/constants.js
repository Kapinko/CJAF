/**
 * These are constant values used in error/validation messaging.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false */

(function ($, cjaf) {
	cjaf.define('lib/message/constants', [
		
	],
	/**
	 * @return {MessageConstants}
	 */
	function () {
		var MessageConstants = (function () {
			var PAGE_ERROR	= '__page',
			FORM_ERROR		= '__form',
			PAGE_SUCCESS	= '__pageSuccess',

			EMPTY			= 'empty',
			INVALID			= 'invalid',
			LENGTH			= 'length',
			MIN_LENGTH		= 'minimumLength',
			MAX_LENGTH		= 'maximumLength',
			MIN_VALUE		= 'minimumValue',
			MAX_VALUE		= 'maximumValue',
			MATCH			= 'match',
			NAME			= 'name',
			NO_MATCH		= 'noMatch',
			NOT_EQUAL       = 'notEqualMatch',
			DATE_AFTER		= 'dateAfter',
			DATE_BEFORE		= 'dateBefore',
			DATE_EXPIRED	= 'dateExpired',
			DATE_RANGE		= 'dateRange',
			TOO_SMALL		= 'tooSmall',
			TOO_LARGE		= 'tooLarge',
			OUT_OF_RANGE	= 'outOfRange',
			ALPHA_NUMERIC      = 'alphaNumeric',

			INVALID_PHONE		= "invalid_phone",
			INVALID_CARD_TYPE	= 'invalid_card_type',
			CC_DAILY_LIMIT_EXCEEDED	= 'ccDailyLimitExceeded';

			return {
				PAGE_ERROR: PAGE_ERROR,
				FORM_ERROR: FORM_ERROR,
				PAGE_SUCCESS: PAGE_SUCCESS,

				EMPTY: EMPTY,
				INVALID: INVALID,
				MIN_LENGTH: MIN_LENGTH,
				MAX_LENGTH: MAX_LENGTH,
				MIN_VALUE: MIN_VALUE,
				MAX_VALUE: MAX_VALUE,
				NOT_EQUAL: NOT_EQUAL,
				NAME: NAME,
				LENGTH: LENGTH,
				MATCH: MATCH,
				NO_MATCH: NO_MATCH,
				DATE_AFTER: DATE_AFTER,
				DATE_BEFORE: DATE_BEFORE,
				DATE_EXPIRED: DATE_EXPIRED,
				DATE_RANGE: DATE_RANGE,
				TOO_SMALL: TOO_SMALL,
				TOO_LARGE: TOO_LARGE,
				OUT_OF_RANGE: OUT_OF_RANGE,
				ALPHA_NUMERIC: ALPHA_NUMERIC,

				INVALID_PHONE: INVALID_PHONE,
				INVALID_CARD_TYPE: INVALID_CARD_TYPE,
				CC_DAILY_LIMIT_EXCEEDED: CC_DAILY_LIMIT_EXCEEDED
			};
		}());
		return MessageConstants;
	});
}(jQuery, cjaf));