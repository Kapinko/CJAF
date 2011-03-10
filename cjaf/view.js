/** JSLint Declarations */
/*global jQuery:false, cjaf: false*/
/*jslint */

(function ($, cjaf) {
	cjaf.define('cjaf/view', [
		'cjaf/namespace'
	],
	/**
	 * @return {cjaf.View}
	 */
	function () {
		var View	= cjaf.namespace('View', function (base_path, renderer, options) {
			options = $.extend(true, View.defaults, options);

			var cache		= {},
			localCache		= ($.hasOwnProperty('sTc') && $.sTc) ? $.sTc : {}, //local template cache.
			load_compiled, load_partials, make_path, load;

			/**
			 * A function to retrieve the currently set default View.
			 * @return {string}
			 */
			View.getDefault	= function () {
				return options.default_view;
			};
			/**
			 * Get the view file extension
			 * @return {string}
			 */
			View.getFileExt	= function () {
				return renderer.extension;
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
					path	= [base_path, widget, view].join('/') + View.getFileExt();
				}

				return path;
			};

			load	= function (path, success) {
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
						cache[path]	= success(response);
					}
				});

				return cache[path];
			};

			load_compiled	= function (path) {
				return load(path, function (template) {
					return renderer.compile(template);
				});
			};

			load_partials	= function (partials) {
				var path, partial, loaded	= {},
				loader	= function (template) {
					return template;
				};

				if (partials) {
					for (partial in partials) {
						if (partials.hasOwnProperty(partial)) {
							path			= make_path(partials[partial]);
							loaded[partial]	= load(path, loader);
						}
					}
				}
				return loaded;
			};
			
			return function (path, data, partials) {
				path			= make_path(path);
				var template	= load_compiled(path);
				//if obj is not provided return the template.

				if (partials) {
					partials	= load_partials(partials);
				}

				return renderer.render(template, data, partials);
			};
		});
		View.defaults	= {
			"default_view": "init"
		};
		
		return View;
	});
}(jQuery, cjaf));