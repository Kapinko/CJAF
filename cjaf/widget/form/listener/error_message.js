/**
 * This is a form listener that will display a message upon an error.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false, window: false*/
/*jslint nomen: false */

(function ($, cjaf, document) {
	cjaf.define('cjaf/widget/form/listener/error_message', [
		'cjaf/widget/form/listener'
	],
	function () {
		/**
		 * A function to create a new DOM element wrapped by jQuery
		 * @param {string} tag
		 * @return {jQuery}
		 */
		var newEl	= function (tag) {
			return $(document.createElement(tag));
		};
		
		$.widget('cjaf.form_listener_error_message', $.cjaf.form_listener, {
			/**
			 * These are the available options for this widget.
			 * @type {Object.<string,*>}
			 */
			options: {
				/**
				 * Should we allow duplicate messages to be displayed.
				 * @type {boolean}
				 */
				"allowDuplicateMessages": false,
				/**
				 * What is the decoration target?
				 * @type {string}
				 */
				"target": 'self',
				/**
				 * The class for the error list.
				 * @type {string}
				 */
				"listClass": 'ui-state-error',
				/**
				 * This is the CSS class for error list message items.
				 * @type {string}
				 */
				"listItemClass": '',
				/**
				 * These are the options that will be passed to the decorator
				 * plugin.
				 * @type {Object.<string,*>}
				 */
				"decoratorOptions":  {
					/**
					 * What level should we apply the decoration?
					 * @type {string}
					 */
					"level": 'element',
					/**
					 * Where should we apply the decoration?
					 * @type {string}
					 */
					"position": 'append'
				},
				/**
				 * This function will create the error list.
				 * @type {function(string, jQuery, Object):jQuery}
				 */
				"createErrorListFunction": function (list_class, target, decorator_options) {
					var error_ul	= newEl('ul'),
					container		= newEl('div'),
					icon_span		= newEl('span');
					
					icon_span.addClass('ui-icon ui-icon-alert')
							.css('float', 'left');
					
					container.addClass(list_class)
							.append(icon_span)
							.append(error_ul);
							
					target.decorate(container, decorator_options);
					return container;
				},
				/**
				 * This function will be used to create the error list items.
				 * @type {function(string, string): jQuery}
				 */
				"createErrorListItemFunction": function (message, item_class) {
					var error_li	= newEl('li')
									.addClass(item_class)
									.html(message);
					return error_li;
				},
				/**
				 * This is a jQuery wrapped reference to the error message list.
				 * @type {jQuery}
				 */
				"errorList": null,
				/**
				 * Handle a form error event.
				 * @param {jQuery.Event} event
				 * @param {string} error_code
				 * @return {boolean}
				 */
				"handleFormError": function (event, error_code) {
					var form	= $(event.target);
					
					if (typeof form.translate === 'function') {
						error_code	= form.translate(error_code);
					}
					
					this.addError(error_code);
					
					return false;
				},
				/**
				 * Handle the form client side submission.
				 * @type {jQuery.Event} event
				 * @return {boolean}
				 */
				"handleFormSubmitClient": function (event) {
					this.clearErrors();
					return false;
				},
				/**
				 * Function to react to the form.cleaer.<formId> event.
				 * @param {jQuery.Event} event
				 * @return {boolean}
				 */
				"handleFormClear": function (event) {
					this.clearErrors();
					return false;
				},
				/**
				 * Display the given error messages.
				 * @param {string} error
				 * @return {jQuery}
				 */
				"addError": function (error) {
					if (error && !this._alreadyDisplayed(error)) {
						var list_item	= this._getErrorListItem(error),
						list			= this._getErrorList();
						
						if (!list.is('ul')) {
							list	= list.find('ul:first');
						}
						list.append(list_item);
					}
					return this.element;
				},
				/**
				 * Clear the displayed error messages.
				 * @return {jQuery}
				 */
				"clearErrors": function () {
					if (this.errorList) {
						this.errorList.remove();
						this.errorList	= null;
					}
					return this.element;
				},
				/**
				 * Get the jQuery reference to the error list.
				 * @return {jQuery}
				 */
				_getErrorList: function () {
					var o	= this.options,
					target, list_class;
					
					if (this.errorList === null) {
						target	= this.element;
						
						if (o.target === 'parent') {
							target	= this.element.parent();
						}
						
						list_class	= this._getListClass();
						
						this.errorList	= o.createErrorListFunction(list_class, target, o.decoratorOptions);
					}
					return this.errorList;
				},
				/**
				 * Get a new error list item
				 * @param {string} message
				 * @return {jQuery}
				 */
				_getErrorListItem: function (message) {
					return this.options.createErrorListItemFunction(message, this._getListItemClass());
				},
				/**
				 * Get the CSS class for the error list.
				 * @return {string}
				 */
				_getListClass: function () {
					return this.options.listClass;
				},
				/**
				 * Get the CSS class for the error list items.
				 * @return {string}
				 */
				_getListItemClass: function () {
					return this.options.listItemClass;
				},
				/**
				 * Have we already displayed this message?
				 * @param {string} message
				 * @return {boolean}
				 */
				_alreadyDisplayed: function (message) {
					var error_list	= this._getErrorList(),
					has_message;
					
					has_message	= error_list.has(':contains("' + message + '")');
					
					return has_message.length > 0;
				}
			}
		});
	});
}(jQuery, cjaf, window.document));