
/** JSLint Declarations */
/*global window: false*/

(function () {
	/**
	 * @param {number} number - the number to round.
	 * @param {number} digits - the number of digits to round to.
	 */
	var round	= function (number, digits) {
		number	= parseFloat(number);

		var multiplier	= Math.pow(10, digits),
			rounded;
		
		rounded	= Math.round(number *  multiplier) / multiplier;

		return rounded;
	};
	window.Math.decimalRound	= round;
}());