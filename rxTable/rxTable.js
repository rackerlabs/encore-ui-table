 /**
  * Encore UI rxActionMenu Component
  * @external rxActionMenu
  * @see {@link http://rackerlabs.github.io/encore-ui/#/components/rxActionMenu}
  */

 /**
  * Encore UI rxBulkSelect Component
  * @external rxBulkSelect
  * @see {@link http://rackerlabs.github.io/encore-ui/#/components/rxBulkSelect}
  */

 /**
  * Encore UI rxPaginate Component
  * @external rxPaginate
  * @see {@link http://rackerlabs.github.io/encore-ui/#/components/rxPaginate}
  */

 /**
  * Encore UI rxSearchBox Component
  * @external rxSearchBox
  * @see {@link http://rackerlabs.github.io/encore-ui/#/components/rxBulkSelect}
  */

 /**
  * Encore UI rxSortableColumn Component
  * @external rxSortableColumn
  * @see {@link http://rackerlabs.github.io/encore-ui/#/components/rxBulkSelect}
  */

 /**
  * Protractor ElementFinder
  * @external ElementFinder
  * @see {@link http://www.protractortest.org/#/api?view=ElementFinder}
  */

 /**
  * Protractor ElementArrayFinder
  * @external ElementArrayFinder
  * @see {@link http://www.protractortest.org/#/api?view=ElementArrayFinder}
  */

 /*jshint node:true*/
var rxTableColumn = require('./rxTableColumn');
var rxTableRow = require('./rxTableRow');

/**
 * @namespace rxTable
 */
var rxTable = {
    /**
     * @instance
     * @description The rxBatchActions page object for the table.
     * @type {external:rxActionMenu}
     */
    batchActions: {
        get: function () {
            return this.bulkSelect.batchActions;
        }
    },

    /**
     * @instance
     * @description The rxBulkSelect page object for the table.
     * @type {external:rxBulkSelect}
     */
    bulkSelect: {
        get: function () {
            return encore.rxBulkSelect.initialize(this.rootElement);
        }
    },

    /**
     * @instance
     * @description Returns the elements for all the data columns on the table.
     * @type {external:ElementArrayFinder}
     */
    columnElements: {
        get: function () {
            var selectors = [];
            _.each(this.config.columns, function (column, index) {
                selectors.push('thead > tr > th.column-title:nth-of-type(' + (index + 1) + ')');
            });
            return this.rootElement.$$(selectors.join(', '));
        }
    },

    /**
     * @instance
     * @description Returns the elements for all the column headers on the table.
     * @type {external:ElementArrayFinder}
     */
    headerElements: {
        get: function () {
            var selectors = [];
            _.each(this.config.columns, function (column, index) {
                var selector = 'thead > tr > th.column-title:nth-of-type(' + (index + 1) + ')';
                if (column.sortable) {
                    selector += ' span.ng-scope:first-of-type';
                }
                selectors.push(selector);
            });
            return this.rootElement.$$(selectors.join(', '));
        }
    },

    /**
     * @instance
     * @description Returns the elements for all the data rows on the table.
     * @type {external:ElementArrayFinder}
     */
    rowElements: {
        get: function () {
            return this.rootElement.$$('tbody > tr');
        }
    },

    /**
     * @instance
     * @description Returns the elements for all the footer rows on the table.
     * @returns {external:ElementArrayFinder}
     */
    footerRowElements: {
        get: function () {
            return this.rootElement.$$('tfoot > tr');
        }
    },

    /**
     * @function
     * @instance
     * @returns {Integer} - A promise for the count of data row elements on the table.
     */
    rowCount: {
        value: function () {
            return this.rowElements.count();
        }
    },

    /**
     * @instance
     * #description The search element on the table.
     * @returns {external:ElementFinder}
     */
    searchElement: {
        get: function () {
            return this.rootElement.$$('rx-search-box').first();
        }
    },

    /**
     * @function
     * @instance
     * @param {Integer} columnIndex - The zero-index of a column in the table.
     * @returns {rxTableColumn} - The rxTableColumn page object for the column.
     */
    column: {
        value: function (columnIndex) {
            return rxTableColumn.initialize(this, columnIndex);
        }
    },

    /**
     * @instance
     * @description A promise to the column headers present on the table.
     * @type {Text[]}
     */
    headers: {
        value: function () {
            return this.headerElements.getText();
        }
    },

    /**
     * @function
     * @instance
     * @param {Integer} rowIndex - The zero-index of a row in the table.
     * @returns {rxTableRow} - The rxTableRow page object for the row (see rxTableRow).
     */
    row: {
        value: function (rowIndex) {
            return rxTableRow.initialize(this, rowIndex);
        }
    },

    /**
     * @instance
     * @description The encore.rxSearchBox page object associated with the table.
     * @type {external:rxSearchBox}
     */
    searchBox: {
        get: function () {
            if (!this.rxSearchBoxObject) {
                this.rxSearchBoxObject = encore.rxSearchBox.initialize(this.searchElement);
            }
            return this.rxSearchBoxObject;
        }
    },

    /**
     * @function
     * @instance
     * @param {String} filterText - The text which will be applied to the searchBox element.
     */
    filter: {
        value: function (filterText) {
            this.searchBox.term = filterText;
        }
    },

    /**
     * @function
     * @instance
     * @param {Object} criteria - A set of columnName/cellValue pairs to match for the rows.
     * @returns {rxTable} - A duplicate rxTable object with only the specified rows.
     * @description Similar to {@link rxTable#getPartial}, except this one uses a criteria object to select rows
     *   and generates a new rxTable object with only those rows.
     */
    getPartialByCriteria: {
        value: function (criteria) {
            var rowXpath = '';
            var tdXpath = [];
            var table = this;

            _.each(criteria, function (value, columnName) {
                var columnIndex = table[columnName].columnIndex;
                var td = 'td[' + columnIndex + '][contains(text(), "' + value + '")]';
                tdXpath.push(td);
            });

            rowXpath = '//tbody/tr[' + tdXpath.join(' and ') + ']';
            return this.getPartial(this.rootElement.all(by.xpath(rowXpath)));
        }
    },

    /**
     * @function
     * @instance
     * @returns {Boolean} - A promise to the presence status of the table on the page.
     */
    isPresent: {
        value: function () {
            return this.rootElement.isPresent();
        }
    },

    /**
     * @function
     * @instance
     * @description The rxPaginate page object for the table
     * @type {external:rxPaginate}
     */
    pagination: {
        get: function () {
            return encore.rxPaginate.initialize(this.rootElement.$('.rx-paginate'));
        }
    }
};

/**
 * @typedef columnConfig
 * @memberof rxTable
 * @property {String} name - Name used as the table property for the column.
 * @property {String} label - Label used to refer to the column in preconstructed tests.
 * @property {rxTableColumn.columnType} type - The column type (see {@link rxTableColumn.types}.
 * @property {String} [sortable=false] - Flag for if the column should be sortable.
 * @property {Object} [extend] - Additional, user-configured properties for this column.
 */

/**
 * @typedef tableConfig
 * @memberof rxTable
 * @type {object}
 * @property {String} label - Label used to refer to the table in preconstructed tests.
 * @property {String} repeaterString - Repeater string for handling sortable columns.
 * @property {Boolean} [floatingHeader=false] - Flag for if the table should have floating headers.
 * @property {rxTable.columnConfig[]} config.columns - Ordered array of column configuration objects.
 * @property {Object} [extend] - Additional, user-configured properties for this table.
 * @property {Object} [extendRow] - Additional, user-configured properties for all table rows.
 * @property {Object} [extendColumn] - Additional, user-configured properties for all table columns.
 */

/**
 * @function
 * @memberof rxTable
 * @param {ElementFinder} rxTableElement - ElementFinder to be transformed into an rxTable page object.
 * @param {rxTable.tableConfig} config - Configuration object describing the table.
 * @returns {rxTable} - Page object representing the table on the page.
 * @description
 *   <p>The {@link rxTable} object exposes a table object with accessors for bulkSelect, the searchBox, individual rows, and
 *   individual columns.  The columns may be accessed as properties using a convenient name specified in the config
 *   object passed to the {@link rxTable.initialize} function.</p>
 *
 *   <p>Rows accessed from an {@link rxTable} object will also inherit the column property names passed in the config object,
 *   but when accessing their data properties, only the appropriate cell for the column on that row will return.</p>
 *
 *   <p>Columns each have a data property that corresponds to an array of data items in that column (or in the context
 *   of a row, simply the corresponding cell's data).  They may optionally have a sort property which will be used
 *   just for the sort tests.  The property accessors and the types can be found in the {@link rxTableColumn} file.</p>
 *
 *   <p>The {@link rxTable} object, {@link rxTableRow} object, and the individual {@link rxTableColumn} objects can be extended
 *   by passing in an object in the appropriate format for {@link http://tinyurl.com/pfyemq5|Object.defineProperties}.</p>
 *
 *   <p><b>IMPORTANT</b>: When adding data accessors from columns, as much as possible we should try to return strings.  In
 *   some cases --most notably the name/id, checkbox, and ip address fields-- we have to return a slightly different
 *   object.  Examples are listed in the {@link rxTableColumn} file.  For sorting, we should return a different sortable types.</p>
 *
 * @example
 * require rxTable = require('path/to/rxTable');
 * var myPage = Page.create({
 *     entityTable: {
 *         get: function () {
 *             var tblElement = $('my-table-selector');
 *             var config = {...};
 *             return rxTable.initialize(tblElement, config);
 *         }
 *     }
 * });
 */
function initialize (rxTableElement, config) {
    // Create a new object so that we don't change the prototype object
    var table = {
        /**
         * @instance
         * @memberof rxTable
         * @description The rxTableElement that the table was built with.
         * @type {ElementFinder}
         */
        rootElement: {
            get: function () { return rxTableElement; }
        },

        /**
         * @instance
         * @memberof rxTable
         * @description The configuration object that the table was built with.
         * @type {Object}
         */
        config: {
            get: function () { return config; }
        },

        /**
         * @function
         * @instance
         * @memberof rxTable
         * @description Similar to {@link rxTable#filter}, except this one only includes the specified row elements.
         *   It does not alter the table filter in any way.
         * @param {external:ElementArrayFinder} elems - The ElementArrayFinder that will replace the rowElements
         * @returns {rxTable} - A duplicate {@link rxTable} object with only the specified rows.
         */
        getPartial: {
            value: function (elems) {
                var partial = initialize(this.rootElement, this.config);
                Object.defineProperty(partial, 'rowElements', {
                    get: function () {
                        return elems;
                    }
                });
                return partial;
            }
        }
    };

    // Add column accessors for each column by name as a property on the table object
    _.each(config.columns, function (column, columnIndex) {
        table[column.name] = {
            get: function () {
                return this.column(columnIndex);
            }
        };
    });

    return Page.create(_.merge(table, rxTable, config.extend));
}

module.exports = {
    /**
     * @name columnTypes
     * @memberof rxTable
     * @type {rxTableColumn.columnTypes}
     */
    columnTypes: rxTableColumn.columnTypes,
    initialize: initialize
};
