/**
 * This is an extension to the JavaScript (ECMAScript) "super" object to allow
 * for a standard prototypical inheritance pattern. (Think object factories) It
 * is copied from Douglas Crockford's site.  This function will be included as
 * a standard function in ECMAScript 3.1.
 * 
 * @see http://javascript.crockford.com/prototypal.html
 */

(function () {
	if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() {}
			F.prototype	= o;
			return new F();
		};
	}
}());