/**
 * This is a listener that will display an error message on a form error.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false, window: false */
/*jslint nomen: false*/
(function ($, cjaf, document) {
	cjaf.define('cjaf/widget/form/element/listener/error_message', [
		'cjaf/widget/form/element/listener',
		'jQuery/jquery.decorator',
		'jQueryUI/jquery.ui.tooltip'
	],
	function () {
		$.widget('cjaf.form_element_listener_error_message', $.cjaf.form_element_listener, {
			options: {
				/**
				 * Should we allow duplicate messages to be displayed.
				 * @type {boolean}
				 */
				allowDuplicateMessages: false,
				/**
				 * @type {string}
				 */
				target: 'self',
				/**
				 * @type {string}
				 */
				listClass: 'ui-state-error',
				/**
				 * @type {string}
				 */
				listItemClass: '',
				/**
				 * These are the options that will be passed to the decorator plugin.
				 * @type {Object}
				 */
				decoratorOptions: {
					/**
					 * @type {string}
					 */
					level: 'element',
					/**
					 * @type {string}
					 */
					position: 'append'
				},
				/**
				 * This function will create the error list.
				 * @type {function(string, jQuery, Object): jQuery}
				 */
				createErrorListFunction: function (list_class, target, decorator_options) {
					var error_ul	= $(document.createElement('ul')),
					container	= $(document.createElement('div')),
					icon_span	= $(document.createElement('span'));

					container.addClass(list_class);
					icon_span.addClass('ui-icon ui-icon-alert')
									.css('float', 'left');
									
					container.append(icon_span);
					container.append(error_ul);

					target.decorate(container, decorator_options);
					return container;
				},
				/**
				 * This function will be used to create the error list items.
				 * @type {function(string, string): jQuery}
				 */
				createErrorListItemFunction: function (message, item_class) {
					var error_li	= $(document.createElement('li'))
									.addClass(item_class)
									.html(message);
					return error_li;
				}
			},
			/**
			 * @type {jQuery}
			 */
			errorList: null,
			/**
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			handleErrorEvent: function (event) {},
			/**
			 * Function to react to the form.clear event.
			 *
			 * @param {Object} event - event string
			 */
			handleClearEvent: function (event) {
				this.clearErrors();
			},
			/**
			 * Function to react to the form.error.clear event.
			 *
			 * @param {jQuery.Event} event
			 * @param {jQuery.Event} errorCode
			 */
			handleValidationFailedEvent: function (event, errorCode) {
				var element	= $(event.target);

				if (element.hasOwnProperty('translate') && typeof element.translate  === 'function') {
					errorCode	= element.translate(errorCode);
				}

				this.addError(errorCode);
			},
			/**
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			handleValidationStartEvent: function (event) {
				this.clearErrors();
			},
			/**
			 * Display the given error messages.
			 *
			 * @param {string} error
			 * @return {jQuery}
			 */
			addError: function (error) {
				if (error && !this._alreadyDisplayed(error)) {
					var list_item	= this._getErrorListItem(error),
						list		= this._getErrorList();
					if (!list.is('ul')) {
						list		= list.find('ul:first');
					}
					list.append(list_item);
				}
				return this.element;
			},
			/**
			 * Clear the displayed error messages.
			 *
			 * @return {jQuery}
			 */
			clearErrors: function () {
				if (this.errorList) {
					this.errorList.remove();
					this.errorList	= null;
				}
				return this.element;
			},
			/**
			 * @return {jQuery}
			 */
			_getErrorList: function () {
				var o	= this.options, target;

				if (this.errorList === null) {
					target		= this.element;

					if (o.target === 'parent') {
						target	= this.element.parent();
					}
					this.errorList	= o.createErrorListFunction(this._getListClass(), target, o.decoratorOptions);
				}
				return this.errorList;
			},
			/**
			 * @param {string} message
			 * @return {jQuery}
			 */
			_getErrorListItem: function (message) {
				return this.options.createErrorListItemFunction(message, this._getListItemClass());
			},
			/**
			 * @return {string}
			 */
			_getListClass: function () {
				return this.options.listClass;
			},
			/**
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
				var has_message	= false,
					error_list	= this._getErrorList();

				has_message	= error_list.has(':contains("' + message + '")');

				return has_message.length > 0;
			}
		});
	});
}(jQuery, cjaf, window.document));