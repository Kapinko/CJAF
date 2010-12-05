/** JSLint Declarations */
/*global jQuery:false, cjaf: false*/
/*jslint white:true, browser:true, onevar: true, undef: true, eqeqeq:true, evil: true,
 plusplus: true, bitwise: true, regexp: false, newcap: true, immed: true, nomen: false */

(function ($, cjaf) {
	cjaf.define('cjaf/view', [],
	/**
	 * @return {View}
	 */
	function () {
		var View	= function (base_path, renderer, options) {
			options	= $.extend(true, View.defaults, options);

			var cache		= {},
			localCache		= ($.hasOwnProperty('sTc') && $.sTc) ? $.sTc : {}, //local template cache.
			load_template, make_path;

			make_path	= function (widget) {
				var view;
				if (typeof view === 'string') {
					view	= options.default_view;

				} else {
					view	= widget.view;
					widget	= widget.name;
				}

				return [base_path, options.widget_dir, widget, view].join('/');
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

			return function(path, data) {
				path			= make_path(path);
				var template	= load_template(path);
				//if obj is not provided return the template.
				return renderer.render(template, data);
			}
		};
		View.defaults	= {
			"widget_dir": "widget",
			"default_view": "init.ejs"
		};

		return View;
	});
}(jQuery, cjaf));