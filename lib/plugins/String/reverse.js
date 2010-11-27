/** JSLint Declarations */
/*global window: false*/

(function () {
	/**
	 * Add a string reverse function to the String object.
	 * @return {string}
	 */
	var reverse	= function () {
		return this.split('').reverse().join('');
	};
	window.String.prototype.reverse	= reverse;
}());