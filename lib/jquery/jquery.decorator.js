(function($){
	$.isDecorator	= function(itemInQuestion){
		var isDecorator	= false;

		if(typeof itemInQuestion.isDecorator === 'function' && itemInQuestion.isDecorator()){
				isDecorator = true;
		}
	   return isDecorator;
	}

	$.fn.addAttributes	= function(attribute_list){
		this.each(function(){
			if(attribute_list != null){
				for(var x in attribute_list){
					$(this).attr(x, attribute_list[x]);
				}
			}
		})
		return this;
	}

	$.fn.addClasses	= function(class_list){
		this.each(function(){
			if($.isArray(class_list)){
				for(var i=0; i < class_list.length; i++){
					$(this).addClass(class_list[i]);
				}
			}
		})
	}

	$.fn.decorate	= function(decorator, settings){
		var config	= {
			level: 'element',
			position: 'append'
		}
		if(settings) $.extend(config, settings);

		var decoration_type	= config.level+'_'+config.position;
		var decorativeEl	= decorator;
		var target			= $(this);

		if($.isDecorator(decorator)){
			decorator.setTarget($(this));
			decoration_type	= decorator.getLevel() + '_' + decorator.getPosition();
			decorativeEl	= decorator.getElement();
		}

		this.each(function(){
			switch(decoration_type){
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
				case 'element_wrap':
				default:
					target.replaceWith(decorativeEl);
					decorativeEl.html(target);
					break;
			}

			//we have to do this here because the element must be put into the
			//document before we can further decorate it.
			if($.isDecorator(decorator)){
				decorator.applySubDecorators(decorativeEl);
			}
		});
		
		return this;
	}

	$.Class.extend('jQuery.Decorator',
		/* @Static */
		{
			defaults: {
				tag: 'span',
				position: 'wrap',
				level: 'element',
				content: '',
				errorClass: 'error'
			}
		},
		/* @Prototype */
		{
			init: function(settings){
				this.config	= $.extend({}, $.Decorator.defaults, settings);

				if(!this.config.attributes){
					this.config['attributes']	= {}
				}
				if(!this.config.classes){
					this.config['classes']	= new Array();
				}
				if(!this.config.decorators){
					this.config['decorators']	= new Array();
				}

				this.element = null;
			},
			getId: function(){
				return this.config.attributes['id'];
			},
			getTag: function(){
			return this.config.tag;
			},
			getPosition: function(){
				return this.config.position;
			},
			getLevel: function(){
				return this.config.level;
			},
			getContent: function(){
				return this.config.content;
			},
			getDecorators: function(){
				return this.config.decorators;
			},
			getAttributes: function(){
				return this.config.attributes;
			},
			getClasses: function(){
				return this.config.classes;
			},
			getErrorClass: function(){
				return 'error';
			},
			getTarget: function(){
				return this.config['target'];
			},
			getValue: function(){
				var values	= new Array;

				if(this.element !== null){
					var jQueryEl	= $(this.element);
					var name		= jQueryEl.attr('name');
					var value		= jQueryEl.attr('value');

					if(name !== null && value !== null){
						values.push({name: value});
					}
				}

				var decorators	= this.getDecorators();
				if($.isArray(decorators)){
					for(var i=0; i < decorators.length; i++){
						var childValues	= decorators[i].getValue();
						if($.isArray(childValues) && childValues.length > 0){
							values = values.concat(childValues);
						}
					}
				}

				return values;
			},
			isDecorator: function(){
				return true;
			},
			isRendered: function(){
				return (this.config['rendered']) ? true : false;
			},
			setId: function(id){
				this.addAttribute('id', id);
				return this;
			},
			setTag: function(tag){
				this.config['tag']	= tag;
				return this;
			},
			setPosition: function(position){
				this.config['position']	= position;
				return this;
			},
			/**
			 * Set the decorator position by the given alignment. the "alignment" can
			 * be one of 'top','bottom','left','right' or 'wrap'. A default alignment
			 * of 'left' is used if the alignment given is not understood.
			 */
			setPositionByAlignment: function(alignment){
				switch(alignment){
					case 'bottom':
					case 'right':
						this.setPosition('append');
						break;
					case 'top':
					case 'left':
					default:
						this.setPosition('prepend');
						break;
				}
				return this;
			},
			setLevel: function(level){
				this.config['level']	= level;
				return this;
			},
			setContent: function(content){
				this.config['content']	= content;
				return this;
			},
			addAttribute: function(name, value){
				this.config.attributes[name]	= value;
				return this;
			},
			addClass: function(className){
				this.config.classes.push(className);
				return this;
			},
			getElement: function(){
				if(this.element == null){
					this.element	= $(document.createElement(this.getTag()));
					this.element.addAttributes(this.getAttributes());
					this.element.addClasses(this.getClasses());

					var content	= this.getContent();
					this.getElement().html(content);

					this.config['rendered']	= true;
				}
				return this.element;
			},
			applySubDecorators: function(instanceElement){
				var decorator_list	= this.getDecorators();
				if($.isArray(decorator_list)){
					for(var i=0; i < decorator_list.length; i++){
						$(instanceElement).decorate(decorator_list[i]);
					}
				}
				return this;
			},
			decorate: function(decorator){
				if(!$.isDecorator(decorator)){
					throw "DecoratorGivenNotValid";
				}
				this.config.decorators.push(decorator);
				return this;
			},
			setTarget: function(target){
				this.config['target']	= target;
			},
			setErrors: function(errors){
				this['errors']	= errors;
				this.getElement().addClass(this.getErrorClass());

				var decorator_list	= this.getDecorators();

				if($.isArray(decorator_list)){
					for(var i=0; i < decorator_list.length; i++){
						decorator_list[i].setErrors(errors);
					}
				}
				return this;
			},
			clearErrors: function(){
				this['errors']	= [];
				this.getElement().removeClass(this.getErrorClass());

				var decorator_list	= this.getDecorators();

				if($.isArray(decorator_list)){
					for(var i=0; i < decorator_list.length; i++){
						decorator_list[i].clearErrors();
					}
				}
				return this;
			}
		}
	);

	return;
})(jQuery);