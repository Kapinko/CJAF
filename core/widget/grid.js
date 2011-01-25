/**
 * A widget to display a grid.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define('core/widget/grid', [
		'core/widget/grid/plugin/dataTables'
	],
	/**
	 * @param {cjaf.Grid.Plugin.DataTables} DataTablesPlugin
	 */
	function (DataTablesPlugin) {
		var gridCounter	= 0;

		$.widget('cjaf.core_grid', {
			options: {
				/**
				 * This is the plugin backend we want to use
				 * @type {cjaf.Grid.Plugin}
				 */
				"plugin": DataTablesPlugin,
				/**
				 * This is the locale object we're going to use for this
				 * grid
				 * @type {Object.<string,*>}
				 */
				"locale": {
					"heading": "CJAF GRID",
					"loading": "Loading...",
					"column_names": {}
				},
				/**
				 * This is the string that we'll use for the table container
				 * element's "id" attribute
				 * @type {string}
				 */
				"tableId": "CJAF-Grid-" + (gridCounter += 1),
				/**
				 * Should we hide this grid if it is empty?
				 * @type {boolean}
				 */
				"hideIfEmpty": false,
				/**
				 * Should the grid be zebra striped?
				 * @type {boolean}
				 */
				"altRows": false,
				/**
				 * Should the grid width be automatically calculated?
				 * @type {boolean}
				 */
				"autoWidth": true,
				/**
				 * How wide do we want our grid to be?
				 * @type {number}
				 */
				"width": undefined,
				/**
				 * How tall do we want our grid to be?
				 * @type {string|number}
				 */
				"height": "100%",
				/**
				 * Should sorting be handled client side?
				 * @type {boolean}
				 */
				"clientSideSort": false,
				/**
				 * This is the URL we'll use to request data from the server.
				 * @type {string}
				 */
				"serverUrl": "",
				/**
				 * What type of HTTP request are we going to make?
				 * @type {string}
				 */
				"requestType": "GET",
				/**
				 * This is the type of data the grid should expect the row
				 * data to be in. (json, xml)
				 * @type {string}
				 */
				"dataFormat": "json",
				/**
				 * These are the locale keys we'll use for the column names.
				 * @todo change this to columnNames in the _create function.
				 * @type {Array.<string>}
				 */
				"columnNameKeys": [],
				/**
				 * These are the specifications we'll use for the columns.
				 * @type {Array.<Object>}
				 */
				"columnSpec": [],
				/**
				 * How many rows do we want to display in this grid?
				 * @type {number}
				 */
				"rowsDisplayed": 10,
				/**
				 * Do we want the number of records displayed?
				 * @type {boolean}
				 */
				"showRowCount": true,
				/**
				 * Should we show the pager buttons?
				 * @type {boolean}
				 */
				"showPageButtons": true,
				/**
				 * Should we allow the user to input the page they want to view
				 * directly?
				 * @type {boolean}
				 */
				"showPageInput": true,
				/**
				 * How should we show the user the current page status information?
				 * @type {string}
				 */
				"pageStatusInfoFormat": undefined,
				/**
				 * This is the locale key we're going to use for the table's
				 * header display.
				 * @todo translate key and put into "headerText"
				 * @type {string}
				 */
				"headerLocaleKey": "heading",
				/**
				 * This is the locale key we're going to use for the table's
				 * loading display.
				 * @todo translate key and put it into "loadingText"
				 * @type {string}
				 */
				"loadingLocaleKey": "loading",
				/**
				 * This is the locale key we're going to use to retrieve the 
				 * column names.
				 * @type {string}
				 */
				"columnNameLocaleKey": "column_names",
				/**
				 * This is the key in the server response that the table should
				 * pull the data rows from.
				 * @type {string}
				 */
				"rowKey": "rows",
				/**
				 * This is the default sort column.
				 * @type {string}
				 */
				"sortColumn": "id",
				/**
				 * This is the default sort direction ("asc" or "desc")
				 * @type {string}
				 */
				"sortDirection": "desc",
				/**
				 * This is the key we're going to use to specify what page
				 * we're requesting or viewing.
				 * @type {string}
				 */
				"pageKey": "page",
				/**
				 * This is the key we're going to use to retrieve the total
				 * number of items from a server response.
				 * @type {string}
				 */
				"totalRowsKey": "total"
			},
			_create: function () {
				var o	= this.options,
				el		= this.element,
				locale	= $.extend(true, o.locale, cjaf.Global.localize(this.widgetName));

				o.headerText	= locale[o.headerLocaleKey];
				o.loadingText	= locale[o.loadingLocaleKey];

				o.columnNames	= $.map(o.columnNameKeys, function (item) {
					return locale[o.columnNameLocaleKey][item]
				});

				this.grid	= new o.plugin(el, o);
				this.grid.render();
			}
		});
	});
}(jQuery, cjaf));