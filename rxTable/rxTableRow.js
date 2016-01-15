/*jshint node:true*/
var encore = require('rx-page-objects');
var rxTableColumn = require('./rxTableColumn');

/**
 * @namespace rxTableRow
 */
var rxTableRow = {
    /**
     * @instance
     * @description The root &lt;tr&gt; ElementFinder for this table row.
     * @type {external:ElementFinder}
     */
    rootElement: {
        get: function () {
            return this.rxTable.rowElements.get(this.rowIndex);
        }
    },

    /**
     * @instance
     * @description The configuration object that the table/row was built with.
     * @type {rxTable.tableConfig}
     */
    config: {
        get: function () {
            return this.rxTable.config;
        }
    },

    /**
     * @function
     * @instance
     * @param {Integer} columnIndex - The zero-index of a column in the row.
     * @returns {rxTableColumn} - The rxTableColumn page object for the column (see {@link rxTableColumn}).
     */
    column: {
        value: function (columnIndex) {
            return rxTableColumn.initializeByRow(this, columnIndex);
        }
    },

    /**
     * @instance
     * @description <p>A promise to a data object representing all the columns in the row.</p>
     *   <p>The data will be transformed by the data method for the
     *   {@link rxTableColumn.columnType} specified in the configuration for each column.</p>
     * @type {Object}
     */
    data: {
        get: function () {
            var page = this;
            var results = [];

            _.each(this.config.columns, function (column, columnIndex) {
                results.push(page.column(columnIndex).data);
            });

            return protractor.promise.fullyResolved(results).then(function (resolved) {
                return _.reduce(page.config.columns, function (data, column, columnIndex) {
                    data[column.name] = resolved[columnIndex];
                    return data;
                }, {});
            });
        }
    },

    /**
     * @instance
     * @description The first link element in the row (typically the device link).
     * @type {external:ElementFinder}
     */
    link: {
        get: function () {
            return this.rootElement.$$('a').first();
        }
    },

    /**
     * @instance
     * @description The rxActionMenu page object for the table (see
     *   {@link http://rackerlabs.github.io/encore-ui/#/components/rxActionMenu|encore.rxActionMenu}).
     * @type {encore.rxActionMenu}
     */
    menu: {
        get: function () {
            return encore.rxActionMenu.initialize(this.rootElement);
        }
    }
};

/**
 * @function
 * @memberof rxTableRow
 * @alias rxTableRow.initialize
 * @param {rxTable} rxTable - Parent rxTable page object for the row.
 * @param {Integer} rowIndex - The zero-index of a row in the table.
 * @returns {rxTableRow} Page object representing the indicated row for the parent rxTable.
 */
function rxTableRowInitialize (rxTable, rowIndex) {

    var tableRow = {
        /**
         * @instance
         * @description The {@link rxTable} object that the row was built with.
         * @memberof rxTableRow
         * @type {rxTable}
         */
        rxTable: {
            get: function () { return rxTable; }
        },

        /**
         * @instance
         * @description The row index that the row was built with.
         * @memberof rxTableRow
         * @type {Integer}
         */
        rowIndex: {
            get: function () { return rowIndex; }
        }
    };

    // Add column accessors for each column by name as a property on the table object
    _.each(rxTable.config.columns, function (column, columnIndex) {
        tableRow[column.name] = {
            get: function () {
                return this.column(columnIndex);
            }
        };
    });

    var extendRow = rxTable.config.extendRow;
    return Page.create(_.merge(tableRow, rxTableRow, extendRow));
}

module.exports = {
    initialize: rxTableRowInitialize
};
