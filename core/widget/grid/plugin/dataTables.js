/**
 * This is a wrapper around the jQGrid plugin to make it work as a back end for
 * the cjaf grid plugin.
 */
/*jslint nomen:false*/
/*global jQuery:false, cjaf:false, document:false, window:false*/

(function ($, cjaf, window) {
	cjaf.define('core/widget/grid/plugin/dataTables', [
		"lib/plugins/Array/iterator",
		'lib/jquery/jquery.dataTables'
	],
	function () {
		var Iterator	= window.Iterator, //this is from the Array iterator plugin.
		default_options	= {
			"useJQueryUIClasses": true,
			"bProcessing": true,
			"bServerSide": true,
			"bFilter": false,
			"bInfo": true,
			"bSort": true,
			"bStateSave": true,
			"bLengthChange": false,
			"bAutoWidth": false,
			"iDisplayLength": 8,
			"sPaginationType": "full_numbers",
			"defaultSort": []
		},
		DataTablesPlugin	= function (element, options) {
			this.element	= element;
			this.options	= $.extend({}, default_options, options, {
				"rowKey": options.rowKey || "aaData",
				"totalRowsKey": options.totalRowsKey || "iTotalRecords",
				"totalRowsDisplayedKey": options.totalRowsDisplayedKey || options.totalRowsKey
			});

			this.init();
		}
		DataTablesPlugin.prototype	= {
			/**
			 * The constructor function.
			 */
			"init": function () {
				var o			= this.options,
				el				= this.element;

				if (!o.columnSpec) {
					$.error("You must provice a valid column specification.");
				}

				el.append($("<table>").attr("id", o.tableId));

				if (o.hideIfEmpty) {
					el.hide();
				}

				this.table		= el.find("#" + o.tableId);
			},
			/**
			 * This function should render the table as a child of the given
			 * jQuery element.
			 * @return {jqGridPlugin}
			 */
			"render": function () {
				var config	= this.translateOptions(),
				heading		= this.options.headerText;

				this.table.dataTable(config);

				if (heading) {
					this.element.prepend("<h4 class=\"ui-widget-header ui-datagrid-header\">"+heading+"</h4>");
				}

				return this;
			},
			/**
			 * This function will reload the currently displayed grid.
			 * @return {jqGridPlugin}
			 */
			"reload": function () {
				var o	= this.translatOptions();

				if (o && o.clientSideSort) {
					this.table.dataTable().fnDestroy();
					this.render();
				} else {
					this.table.dataTable().fnDraw();
				}
				
				return this;
			},
			/**
			 * This function will translate the given cjaf.grid options into
			 * jqGrid options.
			 * @return {Object.<string,*>}
			 */
			"translateOptions": function () {
				var o	= this.options,
				grid	= {
					"aoColumns": this._translateColumnSpec(o.columnSpec, o.columnNames),
					"aaSorting": o.defaultSort,
					"bJQueryUI": o.useJQueryUIClasses ? true : false,
					"bProcessing": o.bProcessing ? true : false,
					"bServerSide": o.bServerSide ? true : false,
					"bPaginate": o.showPageButtons ? true : false,
					"bFilter": o.bFilter ? true : false,
					"bInfo": o.bInfo ? true : false,
					"bSort": o.bSort ? true : false,
					"bStateSave": o.bStateSave ? true : false,
					"bLengthChange": o.bLengthChange ? true : false,
					"bAutoWidth": o.bAutoWidth,
					"iDisplayLength": o.rowsToDisplay,
					"sPaginationType": o.sPaginationType,
					"oLanguage": {},
					"fnRowCallback": o.renderCallbacks.rowComplete,
					"fnHeaderCallback": o.renderCallbacks.headerComplete
				}
				
				if (o.showSearchBox) {
					grid.bFilter	= true;

					if (o.searchLabel) {
						grid.oLanguage.sSearch	= o.searchLabel;
					}
				}
				if (grid.bServerSide || o.clientSideSort) {
					grid.sAjaxSource	= this._getServerSideRequestUrl(o.serverUrl);
					grid.fnServerData	= $.proxy(this, "_loadTableData");

					if (o.clientSideSort) {
						grid.bServerSide	= false;
					}
				}

				grid.fnDrawCallback	= $.proxy(this, "_drawCallback");
				
				return grid;
			},
			/**
			 * Map the translated column names into the given column specification.
			 * @param {Object.<string, *>} spec
			 * @param {Array.<string>} names
			 * @return {Object.<string, *>}
			 */
			_translateColumnSpec: function (spec, names) {
				var item, column, counter = 0, iter,
				renderTranslator	= function(formatter, formatter_options) {
					return function (data) {
						var row_data	= data.aData,
						value	= row_data[data.iDataColumn],
						options	= {
							"colModel": $.extend({}, data.oSettings, {
								"formatoptions": formatter_options
							})
						};

						return formatter(value, options, row_data);
					}
				};
				
				iter	= new Iterator(spec);

				while(iter.hasNext()) {
					column	= iter.getNext();
					column['sTitle'] = names[counter];
					counter += 1;
					//translate the parameters sent to the formatter functions.
					if (typeof column.formatter === 'function') {
						column.fnRender	= renderTranslator(column.formatter, column.formatoptions);
					}

					column.sName	= column.index;
					column.sWidth	= column.width;
				}
				iter.reset();

				return spec;
			},
			/**
			 * This function is called after the data table rendering is complete,
			 * but before the table is shown.
			 * It checks the hideOnEmpty Option and acts accordingly.
			 */
			_drawCallback: function () {
				var data_length	= this.table.dataTable().fnGetData().length,
				hideIfEmpty		= this.options.hideIfEmpty,
				processing		= this.element.find(".dataTables_processing");

				processing.addClass("ui-widget-content ui-state-default ui-corner-all ui-helper-clearfix");

				if (data_length === 0 && hideIfEmpty) {
					this.element.hide();
				} else if (data_length !== 0 && hideIfEmpty && !this.element.is(":visible")) {
					this.element.show();
				}
			},
			/**
			 * Retrieve the data for this table.
			 *
			 * @param {string} url
			 * @param {Array.<Object>} data
			 * @param {function()} callback
			 */
			_loadTableData: function (url, data, callback) {
				var response_filter	= $.proxy(this, '_filterResponse'),
				
				success	= function (response, status, XMLHttpRequest) {
					var table_data	= response_filter(response);
					callback(table_data, status, XMLHttpRequest);
				},
				error	= function (XMLHttpRequest, status, error) {
					
				};
				
				if (typeof this.options.ajax === "function") {
					this.options.ajax(success, error);
					
				} else {
					$.ajax({
						dataType: 'json',
						url: this._getServerSideRequestUrl(url),
						type: this.options.requestType,
						data: this._filterRequest(data),
						success: success,
						error: error
					});
				}
			},
			/**
			 * Filter the dataTables generated request object. You MUST always
			 * store the proper "sEcho" or dataTables will refuse to render your
			 * table information.
			 *
			 * The following data is sent in the dataTables request object.
			 *
			 * iDisplayStart - display start point
			 * iDisplayLength - number of records to display.
			 * iColumns - number of columns being displayed
			 * sSearch - global search field.
			 * bEscapeRegex - is the global search a regular expression?
			 * bSortable_(int) - indicator for if a column is flagged as sortable or not.
			 * bSearchable_(int) - indicator for if a column is flagged as searchable or not.
			 * sSearch_(int) - individual column filter
			 * bEscapeRegex_(int) individual column filter is a regular expression or not.
			 * iSortingCols - number of columns to sort on.
			 * iSortCol_(int) - column being sorted on. (you will need to decode this number for your database.)
			 * sSotrDir_(int) - direction being sorted - "desc" or "asc"
			 * sEcho - information for dataTables to use for rendering, must return back "AS IS"
			 *
			 * @param {Object} request
			 * @return {Object}
			 */
			_filterRequest: function (request) {
				var filteredRequest	= {},
				i, col;

				for(i = 0; i < request.length; i += 1){
					var item	= request[i];

					switch(item.name){
					case 'sEcho':
						this.options.echoStore	= item.value;
						break;
					case 'iDisplayStart':
						filteredRequest.start	= item.value;
						break;
					case 'iDisplayLength':
						filteredRequest.limit	= item.value;
						break;
					case 'iSortCol_0':
						col	= this.options.columnSpec[item.value];
						if (typeof col === 'object' && col.hasOwnProperty('sName')) {
							filteredRequest.sort	= col.sName;
						}
						break;	
					case 'sSortDir_0':
						filteredRequest.dir		= item.value;
						break;
					}

				}
				return filteredRequest;
			},
			/**
			 * Translate the given response into something that dataTables can
			 * understand.
			 *
			 * @param {Object} response
			 * @return {Array.<Object>}
			 */
			_filterResponse: function (response) {
				var aaData	= [],
				rows		= this._getRowsFromResponse(response),
				i, row;

				for (i = 0; i < rows.length; i += 1) {
					row	= this._translateResponseRow(rows[i]);
					aaData.push(row);
				}

				return {
					"sEcho": this.options.echoStore, //An unaltered copy of sEcho sent from the client side.
					"iTotalRecords": this._parseTotalRows(response), //Total records, before filtering.
					"iTotalDisplayRecords": this._parseTotalRowsToDisplay(response), //Total records, after filtering
//					"sColumns": null, //Optional - a string of column names, comma separated.
					"aaData": aaData //The data in a 2D array
				};
			},
			/**
			 * Get the row records from the given response.
			 *
			 * @param {Object} response
			 * @return {Array.<Array>}
			 */
			_getRowsFromResponse: function (response) {
				var key	= this.options.rowKey,
				retval;

				if (typeof response === 'object') {
					retval	= response[key];
				} else {
					retval	= {};
				}
				return retval;
			},
			/**
			 * Translate a given row object into something that dataTables can
			 * understand.
			 *
			 * @param {Object} row
			 * @return {Array}
			 */
			_translateResponseRow: function (row) {
				var rowArray	= [],
				columnSpec		= this.options.columnSpec, i, value, spec;

				for (i = 0; i < columnSpec.length; i += 1) {
					value	= null;
					spec	= columnSpec[i].sName;

					if (spec) {
						value	= row[spec];
					}

					if (value === null || typeof value === 'undefined') {
						value	= '';
					}
					rowArray.push(value);
				}

				return rowArray;
			},
			/**
			 * Get the total number of records from the response
			 *
			 * @param {Object} response
			 * @return {number}
			 */
			_parseTotalRows: function (response) {
				var key	= this.options.totalRowsKey;
				return (response.hasOwnProperty(key)) ? response[key] : 0;
			},
			/**
			 * Get the total number of rows to display from the response
			 *
			 * @param {Object} response
			 * @return {number}
			 */
			_parseTotalRowsToDisplay: function (response) {
				var key	= this.options.totalRowsDisplayedKey;
				return (response.hasOwnProperty(key)) ? response[key] : 0;
			},
			/**
			 * Get the URL to request data from.
			 * @return {string}
			 */
			_getServerSideRequestUrl: function (url) {
				if (typeof url === 'function') {
					url	= url(this.options);
				}
				return url;
			}
		};

		return cjaf.namespace("Grid.Plugin.DataTables", DataTablesPlugin);
	});
}(jQuery, cjaf, window));