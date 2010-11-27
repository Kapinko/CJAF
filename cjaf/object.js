/**
 * These are the customizations that CJAF needs to make to the base JavaScript
 * object.  These customizations assume that jQuery and the CJAF namespace
 * are available.
 */

/** JSLint Defines */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/object', [
		'lib/object'
	],
	function () {
		//Only add the "extend" if it does not currently exist.
		if (Object.prototype.extend !== 'function') {
			/**
			 * This is a function that provides syntatic suger so that we can
			 * extend objects in a more readable way.
			 * 
			 * @param {Object} child_proto - this should be an object literal that
			 *					defines the child object's prototype extensions.
			 * @return {Object}
			 */
			Object.prototype.extend	= function (child_proto) {
				var child	= Object.create(this);
				$.extend(child.prototype, child_proto);
				
				return child;
			};
		}
	});
}(jQuery, cjaf));