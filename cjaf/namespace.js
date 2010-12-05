/**
 * This is a function to create a cjaf child namespace. Optionally you can 
 * give this function the item that should fill that namespace as the second
 * parameter.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	cjaf.define('cjaf/namespace', [], 
	function () {
		cjaf.namespace	= function (namespace, content) {
			var	 parts	= namespace.split('.'), 
			parent		= cjaf,
			child, 
			i;
			
			if (typeof content === 'undefined') {
				content	= {};
			}

			//strip the redundant leading global
			if (parts[0] === 'cjaf') {
				parts	= parts.slice(1);
			}

			for (i = 0; i < parts.length; i += 1) {
				child	= parts[i];
				if (typeof parent[child] === 'undefined') {
					if (typeof parts[(i + 1)] === 'undefined') {
						parent[child] = content;
					} else {
						parent[child] = {};
					}
				}
				parent	= parent[child];
			}

			return parent;
		};
		return cjaf.namespace;
	});
	
}(jQuery, cjaf));