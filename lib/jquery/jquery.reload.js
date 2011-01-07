(function ($) {
	$.fn.reload	= function () {
		return this.each(function () {
			var tag	= this.tagName.toLowerCase(), time, src;

			if (tag === 'img' || tag === 'image') {
				if (typeof this._originalSrc === 'undefined' || this._originalSrc === null) {
					this._originalSrc	= $(this).attr('src');
				}

				time	= 'time=' + (new Date().getTime());
				src		= this._originalSrc;

				if (this._originalSrc.indexOf('?') > -1) {
					src	+= '&' + time;
				} else {
					src	+= '?' + time;
				}
				$(this).attr('src', src);
			}
		});
	}
}(jQuery));