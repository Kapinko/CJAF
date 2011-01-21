/**
 * This is a tooltip implementation that uses the following implementations
 * as references
 * @see http://wiki.jqueryui.com/w/page/12138112/Tooltip
 * @see http://plugins.learningjquery.com/cluetip/
 * @see http://craigsworks.com/projects/qtip2/
 * @see http://www.dinnermint.org/css/creating-triangles-in-css/
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false, document: false*/

(function ($, cjaf) {
	cjaf.define("cjaf/widget/tooltip", [

	],
	function () {
		/**
		 * A widget instance counter.
		 * @type {number}
		 */
		var counter	= 0;

		$.widget("cjaf.tooltip", {
			options: {
				/**
				 * If this is set then the tooltip target will be set to
				 * the closest item to this selector.
				 * @type {string}
				 */
				items: null,
				/**
				 * This must be a function that returns the contents of the
				 * tooltip.
				 * @return {string}
				 */
				content: function () {
					return $(this).attr("title");
				},
				/**
				 * What options should we pass to the jQueryUI position
				 * plugin?
				 * @type {Object.<string,*>}
				 */
				position: {
					my: "left center",
					at: "right center",
					offset: "15 0"
				},
				/**
				 * CSS options that will be passed to the tooltip outer
				 * container on create.
				 * @type {Object.<string,*>}
				 */
				css: {
					"max-width": "250px"
				},
				/**
				 * These are the classes that will be added to the tooltip.
				 * @type {string}
				 */
				classList: "ui-tooltip ui-widget ui-corner-all ui-widget-content",
				/**
				 * Should this tooltip be disabled?
				 * @type {boolean}
				 */
				disabled: false,
				/**
				 * Should this tooltip be the same size as the content.
				 * @type {number}
				 */
				sizeSameAsContent: true
			},

			_create: function () {
				this.tooltip	= this.getTooltip();
				this.opacity	= this.tooltip.css("opacity");

				this.element
					.bind("focus.tooltip mouseover.tooltip", $.proxy(this, "open"))
					.bind("blur.tooltip mouseout.tooltip", $.proxy(this, "close"));
			},

			/**
			 * Get the tooltip
			 * @return {jQuery}
			 */
			getTooltip: function () {
				if (!this.tooltip) {
					this.tooltip	= this._createTooltip();
				}
				return this.tooltip;
			},
			/**
			 * Get the tooltip content
			 * @return {jQuery}
			 */
			getTooltipContent: function () {
				if (!this.tooltipContent) {
					this.tooltipContent	= this._createTooltipContent(this.getTooltip());
				}
				return this.tooltipContent;
			},
			/**
			 * Show this tooltip.
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			open: function (event) {
				var target	= $(event && event.target || this.element), self, content;

				if (this.options.items) {
					target	= target.closest(this.options.items);
				}

				//already visible? possible when both focus and mouseover events occur
				if (!this.current || this.current[0] !== target[0]) {
					this.current		= target;
					this.currentTitle	= target.attr("title");

					self	= this;
					content	= this.options.content.call(target[0], function (response) {
						//IE may instantly serve a cached response, need to give it a chance to finish with _show before that.
						setTimeout(function () {
							if(self.current === target) {
								self._show(event, target, response);
							}
						}, 13);
					});
					if (content) {
						self._show(event, target, content);
					}
				}
			},
			/**
			 * Close this tooltip
			 * @param {jQuery.Event} event
			 * @return {boolean}
			 */
			close: function (event) {
				if (!this.current) {
					return;
				}
				var current		= this.current;
				this.current	= null;
				current.attr("title", this.currentTitle);

				if (this.options.disabled) {
					return;
				}
				current.removeAttr("aria-describedby");
				this.getTooltip().attr("aria-hidden", "true").stop(false, true).fadeOut();

				this._trigger("close", event);
			},
			_destroy: function () {
				if (this.tooltip) {
					this.tooltip.remove();
				}
			},
			/**
			 * Render this tooltip
			 * @param {jQuery.Event} event
			 * @param {jQuery} target
			 * @param {jQuery|string} content
			 */
			_show: function (event, target, content) {
				if (!content) {
					return;
				}
				target.attr("title", "");

				if (this.options.disabled) {
					return;
				}
				this.getTooltipContent().html(content);
				this.getTooltip().css($.extend({
					top: 0,
					left: 0
				}, this.options.css)).show().position($.extend({
					of: target
				}, this.options.position)).hide();

				this.tooltip.attr("aria-hidden", "false");
				target.attr("aria-describedby", this.tooltip.attr("id"));

				if (this.options.sizeSameAsContent && content.length > 0) {
					this.tooltip.width(content.width() + "px");
				}

				this.tooltip.stop(false, true).fadeIn();

				this._trigger("open", event);
			},
			/**
			 * Create the tooltip container
			 * @return {jQuery}
			 */
			_createTooltip: function () {
				return $("<div></div>")
						.attr("id", "ui-tooltip-" + (counter += 1))
						.attr("role", "tooltip")
						.attr("aria-hidden", "true")
						.addClass(this.options.classList)
						.appendTo(document.body)
						.hide();
			},
			/**
			 * Create the tooltip content container
			 * @param {jQuery} tooltip
			 * @return {jQuery}
			 */
			_createTooltipContent: function (tooltip) {
				return $("<div></div>")
					.addClass("ui-tooltip-content")
					.appendTo(tooltip);
			}
		});
	});
}(jQuery, cjaf));