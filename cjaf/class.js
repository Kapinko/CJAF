/**
 * This is a base class for all CJAF standard objects. This provides an
 * easy extension mechanism.
 */

/** JSLint Defines */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/class', [
		
	],
	function () {
		cjaf.Class	= function () {
			
		};
		/**
		 * This function allows the user to create a base object
		 * @param {function()} parent
		 * @param {Object} child_proto
		 * @return {Object}
		 */
		cjaf.Class.extend	= function (parent, child_proto) {
			function child () {
				parent.apply(this,arguments);
			}
			child.prototype	= parent.prototype;
			$.extend(child.prototype, child_proto);
			
			return child;
		}
		
		return cjaf.Class;
	});
}(jQuery, cjaf));