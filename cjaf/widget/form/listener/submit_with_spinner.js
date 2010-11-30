/**
 * This is a form listener that will disable the attached element and display
 * a "spinner" while the form is processing.
 */
/** JSLint Declarations */
/*global jQuery: false, cjaf: false*/

(function ($, cjaf) {
	$.widget('cjaf.submit_with_spinner', $.cjaf.form_listener, {
		/**
		 * These are the available options for this widget.
		 * @type {Object.<string,*>}
		 */
		options: {
			/**
			 * This must be a jQuery object that refers to a "form" element.
			 * @type {jQuery}
			 */
			"form": null,
			/**
			 * This is a string that represents a jQueryUI icon that you wish
			 * to be applied to the left side of this button's label.
			 * @type {string}
			 */
			"iconPrimary": null,
			/**
			 * This is a string that represents a jQueryUI icon that yoyu wish
			 * to apply to the left side of this button's label.
			 * @type {string}
			 */
			"iconSecondary": null,
			/**
			 * This is the list of jQueryUI icons that will be cycled through
			 * during the time that the form is processing.
			 * @type {Array.<string>}
			 */
			"processingIcons": [
				'ui-icon-arrowrefresh-1-w',
				'ui-icon-arrowrefresh-1-n',
				'ui-icon-arrowrefresh-1-e',
				'ui-icon-arrowrefresh-1-s'
			],
			/**
			 * This is the refresh rate of the processing animation.
			 * @type {number}
			 */
			"processingAnimationSpeed": 100,
			/**
			 * This is the URL to the processing image file.
			 * @type {string}
			 */
			"processingImageUrl": '/images/loading/ajax-arrows.gif'
		},
		/**
		 * This is the timeout ID for the processing animation.
		 * @type {Object}
		 */
		"animationTimeoutId": null,
		/**
		 * This is the jQuery element that contains the processing image.
		 * @type {jQuery}
		 */
		"processingImage": null,
		/**
		 * Initialize the submit button and spinner widget.
		 */
		"_create": function () {
			if (!this.element.is(':button, :input[type="submit"]')) {
				throw "You must attach the submit_with_spinner widget to a button."
			}
			
			$.cjaf.form_listener.prototype.apply(this, arguments);
			
			//Make the element we're attached to a button.
			this.element.button({
				"icons": {
					"primary": this.options.iconPrimary,
					"secondary": this.options.iconSecondary
				}
			});
		},
			/**
			 * Function to react to the form.submit.client.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			"handleFormSubmitClient": function (event) {
				this._showInProgress();
			},
			/**
			 * Function to react to the form.submit.server.<formId> event.
			 * @todo rename method to "handleFormSubmitClient"
			 *
			 * @param {Object} event - event string
			 */
			"handleFormSubmitServer": function (event) {
				this._showInProgress();
			},
			/**
			 * Function to react to the form.error.<formId> event.
			 *
			 * @param {jQuery.Event} event
			 * @param {string} message
			 * @return {boolean}
			 */
			"handleFormError": function (event, message) {
				this._hideInProgress();
			},
			/**
			 * Function to react to the form.success.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			"handleFormSuccess": function (event) {
				this._hideInProgress();
			},
			/**
			 * Function to react to the form.clear.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			"handleFormClear": function (event) {
				this._hideInProgress();
			},
			/**
			 * Function to react to the form.validation.failed.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			"handleFormValidationFailed": function (event) {
				this._hideInProgress();
			},
			/**
			 * Function to react to the form.validation.success.<formId> event.
			 *
			 * @param {Object} event - event string
			 */
			"handleFormValidationSuccess": function (event) {},
			/**
			 * Show that the form is in progress.
			 */
			_showInProgress: function () {
				this.element.button('disable');
				this._showProcessing();
			},
			/**
			 * Hide the in progress display.
			 */
			_hideInProgress: function () {
				this._stopProcessingAnimation();
				this.element.button('enable');
			},
			/**
			 * Processing animation function.
			 * @type {number} icon_index
			 */
			_showProcessing: function () {
				var image	= this._getProcessingImage();
				image.fadeIn();
			},
			/**
			 * Stop the in-progress animation.
			 */
			_stopProcessingAnimation: function () {
				var image	= this._getProcessingImage();
				image.fadeOut('normal', function () {
					$(this).css('display', 'none'); //make sure we're hidden
				});
			},
			/**
			 * Get the processing image jQuery element.
			 * @return {jQuery}
			 */
			_getProcessingImage: function () {
				if (!this.processingImage) {
					this.processingImage	= this._createProcessingImage();
				}
				return this.processingImage;
			},
			/**
			 * Create the processing image jQuery element.
			 * @return {jQuery}
			 */
			_createProcessingImage: function () {
				var img, container;
				
				img	= $(document.createElement('img'));
				img.attr('src', this.options.processingImageUrl)
					.attr('alt', '...')
					.addClass('image-in-progress')
					
				container	= $(document.createElement('span'));
				container.addClass('container-image-in-progress')
						.html(img);
						
				this.element.after(container);
				return container;
			}
	});
}(jQuery, cjaf));