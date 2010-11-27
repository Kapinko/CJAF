/** JSLint Declarations */
/*global window: false*/

(function () {
	/**
	 * @return {string}
	 */
	var camelCaseToUnderscore	= function () {
		return this.replace(/([a-z0-9])([A-Z])/g, "$1_$2");
	};
	window.String.prototype.camelCaseToUnderscore	= camelCaseToUnderscore;
}());