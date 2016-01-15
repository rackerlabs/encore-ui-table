/*jshint node:true*/
var rxTableColumn = require('./rxTableColumn');

/**
 * @namespace
 */
var rxTableRow = {
    /**
     * @function
     * @returns {ElementFinder} - The root <tr> ElementFinder for this table row
     */
    rootElement: {
        get: function () {
            return this.rxTable.rowElements.get(this.rowIndex);
        }
    },

    /**
     * @function
     * @returns {Object} - The configuration object that the row was built with.
     */
    config: {
        get: function () {
            return this.rxTable.config;
        }
    },

    /**
     * @function
     * @param {Integer} columnIndex - The zero-index of a column in the row.
     * @returns {rxTableColumn} - The rxTableColumn page object for the column (see rxTableColumn).
     */
    column: {
        value: function (columnIndex) {
            return rxTableColumn.initializeByRow(this, columnIndex);
        }
    },

    /**
     * @function
     * @returns {Object} - A data object representing all the columns in the row
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
     * @returns {ElementFinder} - The first link element in the row (typically the device link)
     */
    link: {
        get: function () {
            return this.rootElement.$$('a').first();
        }
    },

    /**
     * @returns {rxActionMenu} - The rxActionMenu page object for the table (see encore.rxActionMenu)
     */
    menu: {
        get: function () {
            return encore.rxActionMenu.initialize(this.rootElement);
        }
    }
};

/**
 * @function
 * @param {rxTable} rxTable - Parent rxTable page object for the row.
 * @param {Integer} rowIndex - The zero-index of a row in the table.
 * @returns {rxTableRow} Page object representing the indicated row for the parent rxTable.
 */
function initialize (rxTable, rowIndex) {

    var tableRow = {
        /**
         * @function
         * @returns {rxTable} - The rxTable object that the row was built with.
         */
        rxTable: {
            get: function () { return rxTable; }
        },

        /**
         * @function
         * @returns {Integer} - The row index that the row was built with.
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

/**
 * @exports rxTableRow
 */
module.exports = {
    initialize: initialize
};
