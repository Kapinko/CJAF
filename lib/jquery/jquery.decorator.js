/**
 * This is a jQuery plugin that you can use to "decorate" elements. It works
 * much like the Zend Framework Form element decorators.
 */
/** JSLint Declarations */
/*global jQuery: false, window: false*/

(function ($, document) {
	$.isDecorator	= function (itemInQuestion) {
		var isDecorator	= false;

		if (typeof itemInQuestion.isDecorator === 'function' && itemInQuestion.isDecorator()) {
			isDecorator = true;
		}
		return isDecorator;
	};

	$.fn.addAttributes	= function (attribute_list) {
		this.each(function () {
			if (attribute_list) {
				for (var x in attribute_list) {
					if (attribute_list.hasOwnProperty(x)) {
						$(this).attr(x, attribute_list[x]);
					}
				}
			}
		});
		return this;
	};

	$.fn.addClasses	= function (class_list) {
		this.each(function () {
			if ($.isArray(class_list)) {
				for (var i = 0; i < class_list.length; i += 1) {
					$(this).addClass(class_list[i]);
				}
			}
		});
	};

	$.fn.decorate	= function (decorator, settings) {
		var config	= {
			level: 'element',
			position: 'append'
		}, decoration_type, decorativeEl, target;
		
		if (settings) {
			$.extend(config, settings);
		}

		decoration_type	= config.level + '_' + config.position;
		decorativeEl	= decorator;
		target			= $(this);

		if ($.isDecorator(decorator)) {
			decorator.setTarget($(this));
			decoration_type	= decorator.getLevel() + '_' + decorator.getPosition();
			decorativeEl	= decorator.getElement();
		}

		this.each(function () {
			switch (decoration_type) {
			case 'content_prepend':
				target.prepend(decorativeEl);
				break;
			case 'content_append':
				target.append(decorativeEl);
				break;
			case 'content_wrap':
				target.wrapInner(decorativeEl);
				break;
			case 'element_append':
				target.after(decorativeEl);
				break;
			case 'element_prepend':
				target.before(decorativeEl);
				break;
			default: //default is 'element_wrap'
				target.replaceWith(decorativeEl);
				decorativeEl.html(target);
				break;
			}

			//we have to do this here because the element must be put into the
			//document before we can further decorate it.
			if ($.isDecorator(decorator)) {
				decorator.applySubDecorators(decorativeEl);
			}
		});
		
		return this;
	};
	
	$.Decorator	= function (settings) {
		var c	= $.extend({}, $.Decorator.defaults, settings);
		
		if (!c.attributes) {
			c.attributes	= {};
		}
		if (!c.attributes.hasOwnProperty('id')) {
			c.attributes.id	= null;
		}
		if (!c.classes) {
			c.classes		= [];
		}
		if (!c.decorators) {
			c.decorators	= [];
		}
		
		this.attributes	= c.attributes;
		this.classes	= c.classes;
		this.decorators	= c.decorators;
		
		this.tag		= c.tag;
		this.position	= c.position;
		this.level		= c.level;
		this.content	= c.content;
		this.errorClass	= c.errorClass;
		
		this.element	= null;
		this.rendered	= false;
		this.target		= null;
		
		this.errors		= [];
	};
	$.Decorator.defaults	= {
		"tag": 'span',
		"position": 'wrap',
		"level": 'element',
		"content": '',
		"errorClass": 'error'
	};
	$.Decorator.InvalidException	= {
		"name": "DecoratorInvalidException",
		"message": "Decorator given was not a valid decorator."
	};
	$.Decorator.prototype	= {
		getId: function () {
			return this.attributes.id;
		},
		getTag: function () {
			return this.tag;
		},
		getPosition: function () {
			return this.position;
		},
		getLevel: function () {
			return this.level;
		},
		getContent: function () {
			return this.content;
		},
		getDecorators: function () {
			return this.decorators;
		},
		getAttributes: function () {
			return this.attributes;
		},
		getClasses: function () {
			return this.classes;
		},
		getErrorClass: function () {
			return 'error';
		},
		getTarget: function () {
			return this.target;
		},
		getValue: function () {
			var values	= [],
			decorators	= this.getDecorators(),
			jQueryEl, name, value, i, childValues;

			if (this.element !== null) {
				jQueryEl	= $(this.element);
				name		= jQueryEl.attr('name');
				value		= jQueryEl.attr('value');

				if (name !== null && value !== null) {
					values.push({
						name: value
					});
				}
			}

			if ($.isArray(decorators)) {
				for (i = 0; i < decorators.length; i += 1) {
					childValues	= decorators[i].getValue();
					if ($.isArray(childValues) && childValues.length > 0) {
						values = values.concat(childValues);
					}
				}
			}

			return values;
		},
		isDecorator: function () {
			return true;
		},
		isRendered: function () {
			return this.rendered;
		},
		setId: function (id) {
			this.addAttribute('id', id);
			return this;
		},
		setTag: function (tag) {
			this.tag	= tag;
			return this;
		},
		setPosition: function (position) {
			this.position	= position;
			return this;
		},
		/**
		 * Set the decorator position by the given alignment. the "alignment" can
		 * be one of 'top','bottom','left','right' or 'wrap'. A default alignment
		 * of 'left' is used if the alignment given is not understood.
		 */
		setPositionByAlignment: function (alignment) {
			if (alignment === 'bottom' || alignment === 'right') {
				this.setPosition('append');
			} else {
				this.setPosition('prepend');
			}
			return this;
		},
		setLevel: function (level) {
			this.level	= level;
			return this;
		},
		setContent: function (content) {
			this.content	= content;
			return this;
		},
		addAttribute: function (name, value) {
			this.attributes[name]	= value;
			return this;
		},
		addClass: function (className) {
			this.classes.push(className);
			return this;
		},
		getElement: function () {
			if (!this.element) {
				this.element	= $(document.createElement(this.getTag()));
				this.element.addAttributes(this.getAttributes());
				this.element.addClasses(this.getClasses());

				var content	= this.getContent();
				this.getElement().html(content);

				this.rendered	= true;
			}
			return this.element;
		},
		applySubDecorators: function (instanceElement) {
			return this.doForEachDecorator($.proxy(function (decorator) {
				$(instanceElement).decorate(decorator);
			}, this));
		},
		decorate: function (decorator) {
			if (!$.isDecorator(decorator)) {
				throw $.Decorator.InvalidException;
			}
			this.decorators.push(decorator);
			return this;
		},
		setTarget: function (target) {
			this.target	= target;
			return this;
		},
		setErrors: function (errors) {
			this.errors	= errors;
			this.getElement().addClass(this.getErrorClass());

			var callback	= $.proxy(function (decorator) {
				decorator.setErrors(errors);
			}, this);

			return this.doForEachDecorator(callback);
		},
		clearErrors: function () {
			this.errors	= [];
			this.getElement().removeClass(this.getErrorClass());

			var callback	= $.proxy(function (decorator) {
				decorator.clearErrors();
			}, this);

			return this.doForEachDecorator(callback);
		},

		doForEachDecorator: function (callback) {
			var decorator_list	= this.getDecorators(), i;

			if ($.isArray(decorator_list)) {
				for (i = 0; i < decorator_list.length; i += 1) {
					callback(decorator_list[i]);
				}
			}
			return this;
		}
	};

	return;
}(jQuery, window.document));