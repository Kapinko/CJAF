/**
 * This is a wrapper around the jQGrid plugin to make it work as a back end for
 * the cjaf grid plugin.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false*/

(function ($, cjaf) {
	cjaf.define('core/widget/grid/plugin/jqGrid', [
		'lib/i18n/jquery/ui/jqgrid/grid.locale-en',
		'lib/jquery/ui/jquery.jqGrid.min'
	],
	function () {
		var jqGridPlugin	= function (element, options) {
			this.element	= element;
			this.options	= options;
			
			this.init();
		}
		jqGridPlugin.prototype	= {
			/**
			 * The constructor function.
			 */
			"init": function () {

			},
			/**
			 * This function should render the table as a child of the given
			 * jQuery element.
			 * @return {jqGridPlugin}
			 */
			"render": function () {
				var el	= this.element,
				o		= this.options,
				tableSelector	= "#" + o.tableId

				el.append($("<table>").attr("id", o.tableId))
						.append($("<div>").attr("id", o.tableId + "-pager"));

				el.find(tableSelector).jqGrid(this.translateOptions(o));

				return this;
			},
			/**
			 * This function will reload the currently displayed grid.
			 * @return {jqGridPlugin}
			 */
			"reload": function () {
				return this;
			},
			/**
			 * This function will translate the given cjaf.grid options into
			 * jqGrid options.
			 * @return {Object.<string,*>}
			 */
			"translateOptions": function () {
				var grid	= this.options,
				jqgrid_options	= {
					"url": grid.serverUrl,
					"datatype": grid.dataFormat,
					"colNames": grid.columnNames,
					"colModel": grid.columnSpec,
					"pager": "#" + grid.tableId + "-pager",
					"sortname": grid.sortColumn,
					"sortorder": grid.sortDirection,
					"viewrecords": grid.showRowCount,
					"rowNum": grid.rowsDisplayed,
					"altRows": grid.altRows,
					"autowidth": grid.autoWidth,
					"height": grid.height,
					"width": grid.width,
					"pgbuttons": grid.showPageButtons,
					"pginput": grid.showPageInput,
					"pgtext": grid.pageStatusInfoFormat,
					"caption": grid.headerText,
					"loadText": grid.loadingText,
					"jsonReader": {
						"root": grid.rowKey,
						"total": function (obj) {return Math.floor(obj[grid.totalRowsKey] / obj[grid.rowKey].length);},
						"page": function (obj) { return Math.floor(obj.start / obj.limit); },
						"records": grid.totalRowsKey,
						"id": "0",
						"repeatitems": false
					},
					"serializeGridData": function (postData) {
						return {
							"sort": postData.sidx,
							"start": postData.page * postData.rows,
							"limit": postData.rows,
							"dir": postData.sord
						}
					}
				};
				
				return jqgrid_options;
			}
		};
		
		return cjaf.namespace("Grid.Plugin.jqGrid", jqGridPlugin);
	});
}(jQuery, cjaf));