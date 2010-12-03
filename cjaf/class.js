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
		//Temporary constructor function.
		var F	= function () {};

		cjaf.Class	= function () {
			
		};
		/**
		 * This function allows the user to create a base object
		 * @param {function()} parent
		 * @param {Object} child_proto
		 * @return {Object}
		 */
		cjaf.Class.extend	= function (parent, child_proto) {
			F.prototype	= parent.prototype;

			var child = function () {};
			child.prototype	= new F();
			child.prototype	= $.extend(true, child.prototype, child_proto);
			child.prototype.constructor	= child;
			
			return child;
		};
		
		return cjaf.Class;
	});
}(jQuery, cjaf));