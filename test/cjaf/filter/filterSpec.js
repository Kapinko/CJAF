define([
	'lib/underscore',
	'cjaf/filter',
	'lib/jasmine'
],
function (_, Filters) {
	var testobj;
	
	beforeEach(function() {
		testobj	= {};
		_.extend(testobj, Filters);
	});
	
	describe('Filters', function () {
		it('should add the given function to the _filters object under the given property name', function () {
			var bob_filter	= function(bob) { return 'foo'; };
			testobj.addFilter('bob', bob_filter);
			expect(testobj._filters.bob[0]).toEqual(bob_filter);
			expect(testobj.filter('bob', 'blah')).toEqual('foo');
		});
		
		it('should apply the given filter to all properties when a "all" is used as the property name',
		function () {
			var foo	= function (prop) { return 'foo'; };
			testobj.addFilter('all', foo);
			
			expect(testobj.filter('foo', 'blah')).toEqual('foo');
			expect(testobj.filter('blah','more blah')).toEqual('foo');
		});
		
		it('should set _filters to the given object when setFilters is called.',
		function () {
			var testconf	= {
				'bob': [
					function () { return 'foo'; }
				]
			};
			testobj.setFilters(testconf);
			expect(testobj._filters).toEqual(testconf);
		});
		
		it('should remove the given filter for the given property when removeFilter is called',
		function () {
			var f1	= function (prop) { return prop + 'f1'; },
			f2		= function (prop) { return prop + 'f2'; },
			g1		= function (prop) { return 'g1'; };
			
			testobj.addFilter('f', f1)
				.addFilter('f', f2)
				.addFilter('g', g1);
				
			expect(testobj.filter('f', 'blah')).toEqual('blahf1f2');
			expect(testobj.filter('g', 'blah')).toEqual('g1');
			
			testobj.removeFilter('f', f1);
			
			expect(testobj.filter('f', 'blah')).toEqual('blahf2');
			expect(testobj.filter('g', 'blah')).toEqual('g1');
		});
		
		it('should apply filters in the order that their added.', function () {
			var f1	= function (prop) { return prop + 'f1'; },
			f2		= function (prop) { return prop + 'f2'; },
			f3		= function (prop) { return prop + 'f3'; };
			
			testobj.addFilter('f', f1)
				.addFilter('f', f2)
				.addFilter('f', f3);
				
			expect(testobj.filter('f', 'x')).toEqual('xf1f2f3');
		});
		
		it('should apply the all property filters after the specific filters.',
		function () {
			var f1	= function (prop) { return prop + 'f1'; },
			f2		= function (prop) { return prop + 'f2'; },
			a1		= function (prop) { return prop + 'a1'; };
			
			testobj.addFilter('f', f1)
				.addFilter('all', a1)
				.addFilter('f', f2);
				
			expect(testobj.filter('f', 'x')).toEqual('xf1f2a1');
		});
	});
});
