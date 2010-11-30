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
		var cjaf.Class	= function () {
			
		};
		/**
		 * This function allows the user to create a base object
		 * @param {function()} ctor - the constructor function
		 * @param {Object} child_proto
		 * @return {Object}
		 */
		cjaf.Class.extend	= function (ctor, child_proto) {
			var self	= this, child;
			ctor.prototype	= this.prototype;
			$.extend(ctor.prototype, child_proto);
			
			return ctor;
		}
			
		/**
		 * This is a function that provides syntatic sugar so that we can
		 * extend objects in a more readable way.
		 * @param {Object} child_proto - this should be an object literal
		 * 					that defines the child object's prototype
		 * 					extensions
		 * @return {Object}
		 */
		cjaf.Class.prototype.extend	= function (child_proto) {
			var self	= this, child;
			
			child	= function () {
				self.apply(this, arguments);
			};
			child.prototype	= this.prototype;
			$.extend(child.prototype, child_proto);
			
			return child;
		};
	});
}(jQuery, cjaf));