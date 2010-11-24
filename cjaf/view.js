/** JSLint Declarations */
/*global jQuery:false, cjaf: false*/
/*jslint white:true, browser:true, onevar: true, undef: true, eqeqeq:true, evil: true,
 plusplus: true, bitwise: true, regexp: false, newcap: true, immed: true, nomen: false */

(function ($, cjaf) {
	var cache		= {},
		localCache	= ($.hasOwnProperty('sTc') && $.sTc) ? $.sTc : {}, //local template cache.
		loadTemplate, getRenderingJsFromString;
		
	getRenderingJsFromString	= function (str) {
		var blah =
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join(";p.push('")
			  .split("\r").join("\\'") +
			"');}return p.join('');";
		return blah;
	};
		
	loadTemplate	= function (path) {
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
				cache[path]	= new Function("obj", getRenderingJsFromString(response));
			}
		});
		
		return cache[path];
	};
	
	cjaf.view	= function (path, obj) {
		var template	= loadTemplate(path);
		//if obj is not provided return the template;
		return obj ? template(obj) : template;
	};
	
}(jQuery, cjaf));