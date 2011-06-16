define([
	'lib/underscore',
	'cjaf/filter',
	'lib/qunit'
],
function (_, Filters) {
	describe('Filters', function () {
		var testobj;

		before(function () {
			testobj	= _.extend({}, Filters);
		});
		
		it('should add the given function to the _filters object under the given property name', function () {
			var bob_filter	= function(bob) { return 'foo'; };
			testobj.addFilter('bob', bob_filter);
			assert(testobj._filters.bob[0]).should(eql, bob_filter);
			assert(testobj.filter('bob', 'blah')).should(eql, 'foo');
		});
		
		it('should apply the given filter to all properties when a "all" is used as the property name',
		function () {
			var foo	= function (prop) { return 'foo'; };
			testobj.addFilter('all', foo);
			
			assert(testobj.filter('foo', 'blah')).should(eql, 'foo');
			assert(testobj.filter('blah','more blah')).should(eql, 'foo');
		});
		
		it('should set _filters to the given object when setFilters is called.',
		function () {
			var testconf	= {
				'bob': [
					function () { return 'foo'; }
				]
			};
			testobj.setFilters(testconf);
			assert(testobj._filters).should(eql, testconf);
		});
		
		it('should remove the given filter for the given property when removeFilter is called',
		function () {
			var f1	= function (prop) { return prop + 'f1'; },
			f2		= function (prop) { return prop + 'f2'; },
			g1		= function (prop) { return 'g1'; };
			
			testobj.addFilter('f', f1)
				.addFilter('f', f2)
				.addFilter('g', g1);
				
			assert(testobj.filter('f', 'blah')).should(eql, 'blahf1f2');
			assert(testobj.filter('g', 'blah')).should(eql, 'g1');
			
			testobj.removeFilter('f', f1);
			
			assert(testobj.filter('f', 'blah')).should(eql, 'blahf2');
			assert(testobj.filter('g', 'blah')).should(eql, 'g1');
		});
		
		it('should apply filters in the order that their added.', function () {
			var f1	= function (prop) { return prop + 'f1'; },
			f2		= function (prop) { return prop + 'f2'; },
			f3		= function (prop) { return prop + 'f3'; };
			
			testobj.addFilter('f', f1)
				.addFilter('f', f2)
				.addFilter('f', f3);
				
			assert(testobj.filter('f', 'x')).should(eql, 'xf1f2f3');
		});
		
		it('should apply the all property filters after the specific filters.',
		function () {
			var f1	= function (prop) { return prop + 'f1'; },
			f2		= function (prop) { return prop + 'f2'; },
			a1		= function (prop) { return prop + 'a1'; };
			
			testobj.addFilter('f', f1)
				.addFilter('all', a1)
				.addFilter('f', f2);
				
			assert(testobj.filter('f', 'x')).should(eql, 'xf1f2a1');
		});
	});
});