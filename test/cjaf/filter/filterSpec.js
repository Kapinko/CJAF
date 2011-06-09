define([
	'lib/underscore',
	'cjaf/filter'
],
function (_, Filters) {
	var testobj	= {};
	_.extend(testobj, Filters);
	
	describe('Filters', function () {
		it('should add the given function to the _filters object under the given property name', function () {
			var bob_filter	= function(bob) { return 'foo'; };
			testobj.addFilter('bob', bob_filter);
			expect(testobj.filter('bob', 'blah')).toEqual('foo');
		});
	});
});
