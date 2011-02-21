/**
 * This is a widget that will expects a model object identifier and will attempt to load the model object that identifier represents.
 */
/**JSLint Defines*/
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define("core/widget/loader", [
		"cjaf/model/base"
	],
	/**
	 * @param {cjaf.Model.Base} BaseModel
	 */
	function (BaseModel) {
		$.widget("cjaf.core_loader", {
			options: {
				/**
				 * This is the identifier of the model object that we need to
				 * retrieve or the model object itself or a function that
				 * can retrieve the model or identifier.
				 * @type {*}
				 */
				"model": null,
				/**
				 * This is the function that will be used to load the model object
				 * @type {function(string, function(), function()):boolean)}
				 */
				"loader": $.noop
			},

			_create: function () {
				var model	= this.options.model;

				switch (typeof model) {
				case "string":
				case "number":
					this._load(model);
					break;
				case "function":
					model	= model();
					this._create();
					break;
				default:
					this._handleLoad(model);
				}

			},
			/**
			 * Load the model object
			 * @param {string|number} model_id
			 * @return {boolean}
			 */
			_load: function (model_id) {
				if (this._preLoad(model_id)) {
					this.options.load(model_id,
						$.proxy(this, "_handleLoad"),
						$.proxy(this, "_handleError")
					);
				}
			},
			/**
			 * This function will be called before we attempt to load the model
			 * object from the server.
			 * @param {string|number} model_id
			 * @return {boolean} - if this returns false, then we will not
			 *				attempt to load the model object.
			 */
			_preLoad: function (model_id) {
				return true;
			},
			/**
			 * Handle a successful load of the model object.
			 * @param {BaseModel} model
			 * @param {XMLHttpRequest} XMLHttpRequest
			 * @return {boolean}
			 */
			_handleLoad: function (model, XMLHttpRequest) {
				$.error("This method must be overridden");
				return false;
			},
			/**
			 * Handle a model object load failure.
			 * @param {XMLHttpRequest}
			 * @param {string} status
			 * @param {Object.<string,*>} errorThrown
			 * @return {boolean}
			 */
			_handleError: function (XMLHttpRequest, status, errorThrown) {
				$.error("Could not load model object: " + status);
				return false;
			}
		});
	});
}(jQuery, cjaf));
