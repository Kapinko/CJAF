define([
	'lib/underscore',
	'cjaf/event',
	'lib/qunit'
],
function (_, Events) {
	describe('Events', function () {
		var testobj;

		before(function () {
			testobj	= _.extend({}, Events);
		});
		
		it('should add the given function to the _callbacks object under the given event name', function () {
			var bob_event	= function(bob) { return 'foo'; };
			testobj.bind('bob', bob_event);
			assert(testobj._callbacks.bob[0]).should(eql, bob_event);
		});
		
		it('should bind the given callback to all events when "all" is used as the event name.',
		function () {
			var callback	= this.spy();
			testobj.bind('all', callback);
			
			testobj.trigger('boo');
			testobj.trigger('ahhh');
			
			assert(callback.calledTwice).should(be);
		});
		
		it('should bind the given callback to the given event name when bind is called with a event name string.',
		function () {
			var cb	= this.spy();
			testobj.bind('myevent', cb);
			
			testobj.trigger('boo');
			testobj.trigger('myevent');
			
			assert(cb.calledOnce).should(be);
		});
			
		it('should remove all bound callbacks to the given event if a callback function is not supplied',
		function () {
			var s1	= this.spy(),
			s2	= this.spy(),
			s3	= this.spy();

			testobj.bind('myevent', s1)
				.bind('myevent', s2)
				.bind('other', s3)
				.unbind('myevent')
				.trigger('myevent')
				.trigger('other');

			assert(s1.callCount).should(eql, 0);
			assert(s2.callCount).should(eql, 0);
			assert(s3.calledOnce).should(be);
		});
		it('should remove all callbacks for all events when not provided an event name.',
		function () {
			var s1	= this.spy(),
			s2	= this.spy(),
			s3	= this.spy();

			testobj.bind('myevent', s1)
				.bind('myevent', s2)
				.bind('other', s3)
				.unbind()
				.trigger('myevent')
				.trigger('other');

			assert(s1.called).shouldNot(be);
			assert(s2.called).shouldNot(be);
			assert(s3.called).shouldNot(be);
		});
		
		it('should pass the event name as the first agurment for callbacks listening to all events.',
		function () {
			var s1	= this.spy();
			
			testobj.bind('all', s1)
				.trigger('myevent');
				
			assert(s1.calledWith('myevent')).should(be);
			assert(s1.calledOnce).should(be);
		});
		
		it('should execute the callback in the scope of the observed object.',
		function () {
			var s1	= this.spy();
			
			testobj.bind('blah', s1)
				.trigger('blah');
				
			assert(s1.thisValues[0]).should(eql, testobj);
		});
	});
});