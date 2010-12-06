/** JSLint Declarations */
/*global jQuery:false, cjaf: false*/
/*jslint */

(function ($, cjaf) {
	cjaf.define('cjaf/view', [],
	/**
	 * @return {cjaf.View}
	 */
	function () {
		var View	= cjaf.namespace('View', function (base_path, renderer, options) {
			options = $.extend(true, View.defaults, options);

			var cache		= {},
			localCache		= ($.hasOwnProperty('sTc') && $.sTc) ? $.sTc : {}, //local template cache.
			load_template, make_path;

			/**
			 * A function to retrieve the currently set default View.
			 * @return {string}
			 */
			View.getDefault	= function () {
				return options.default_view;
			};

			make_path	= function (widget) {
				var view, path;
				if (typeof widget === 'string') {
					view	= View.getDefault();

				} else {
					view	= widget.view;
					widget	= widget.name;
				}
				
				if (widget.charAt(0) === '/') {
					path	= widget;
				} else {
					path	= [base_path, widget, view].join('/');
				}

				return path;
			};
			load_template	= function (path) {
				if (cache[path]) {
					return cache[path];
				}

				if (localCache[path]) {
					return localCache[path];
				}

				$.ajax({
					url: path,
					method: 'GET',
					async: false,
					success: function (response, textStatus, XMLHttpRequest) {
						cache[path]	= renderer.compile(response);
					}
				});

				return cache[path];
			};

			return function (path, data) {
				path			= make_path(path);
				var template	= load_template(path);
				//if obj is not provided return the template.
				return renderer.render(template, data);
			};
		});
		View.defaults	= {
			"default_view": "init.phtml"
		};
		
		return View;
	});
}(jQuery, cjaf));