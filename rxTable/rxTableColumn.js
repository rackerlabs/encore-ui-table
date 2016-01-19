/*jshint node:true*/
var _ = require('lodash');
var Page = require('astrolabe');

var encore = require('rx-page-objects');
var moment = require('moment');

// The date format comes from the Encore UI framework, see:
// http://rackerlabs.github.io/encore-ui/#/styleguide/basics#date-formatting
var dateFormat = 'MMM D, YYYY @ HH:mm (UTCZZ)';

/**
 * @function
 * @alias rxTableColumn.columnTypes.checkbox.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {Boolean} Whether or not the checkbox in the cell is checked/selected
 * @example rxColumnCheckboxData(elem) => false
 */
function rxColumnCheckboxData(elem) {
    return elem.$('input').isSelected();
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.checkbox.data
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String} The Encore standard UTC date string for Encore standard date value of the cell
 */
function rxColumnDateData(elem) {
    return elem.getText().then(function (text) {
        return moment(text.trim(), dateFormat).utc().format(dateFormat);
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.date.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {Number} The seconds since Epoch for the Encore standard date value of the cell
 */
function rxColumnDateSort(elem) {
    return elem.getText().then(function (text) {
        text = text.trim();
        return text === 'N/A' ? 0 : moment(text, dateFormat).unix();
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.relativeDate.data
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String} The Encore standard UTC date string for Encore standard relative date value of the cell
 */
function rxColumnRelativeDateData(elem) {
    return elem.element(by.xpath('ancestor-or-self::td/time')).getAttribute('datetime').then(function (text) {
        return moment(text, dateFormat).utc().format(dateFormat);
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.relativeDate.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {Number} The seconds since Epoch for the Encore standard relative date value of the cell
 */
function rxColumnRelativeDateSort(elem) {
    return elem.element(by.xpath('ancestor-or-self::td/time')).getAttribute('datetime').then(function (text) {
        return moment(text, dateFormat).unix();
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.string.data
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String} The string value of the cell's data
 */
function rxColumnStringData(elem) {
    return elem.getText().then(function (text) {
        return text.trim();
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.string.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String} The string value of the cell's data
 */
function rxColumnStringSort(elem) {
    return elem.getText().then(function (text) {
        text = text.trim();
        return text === 'N/A' ? '' : text.toLowerCase();
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.bytes.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {Number} The integer or float value from the table cell 'data-bytes' attribute
 */
function rxColumnBytesSort(elem) {
    return elem.element(by.xpath('ancestor-or-self::td')).getAttribute('data-bytes').then(function (text) {
        return parseFloat(text.trim());
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.number.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {Number} The integer or float value from the table cell, postive or negative
 */
function rxColumnNumberSort(elem) {
    return elem.getText().then(function (text) {
        return parseFloat(text.trim());
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.ipAddress.data
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String[]} An array of IP addresses from the table cell
 * @example rxColumnIpData(myElem) => ['8.8.8.8', '8.8.4.4']
 */
function rxColumnIpData(elem) {
    return elem.getText().then(function (text) {
        return _.map(text.split('\n'), function (str) {
            return str.trim();
        });
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.actionCog.sort
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String[]} An array of IP addresses from the table cell
 * @example rxColumnIpData(myElem) => ['8.8.8.8', '8.8.4.4']
 */
function rxColumnIpSort(elem) {
    return elem.getText().then(function (text) {
        return _.map(text.split('\n'), function (str) {
            str = str.trim();
            return str === 'N/A' ? '' : str;
        });
    });
}
/**
 * @function
 * @alias rxTableColumn.columnTypes.nameId.data
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {Object} An object containing the name and id from the table cell
 * @example rxColumnNameIdData(myelem) => { name: 'MyDevice', id: '12345'}
 */
function rxColumnNameIdData(elem) {
    return elem.getText().then(function (text) {
        var splits = _.map(text.split('\n'), function (str) {
            return str.trim();
        });

        return {
            name: splits[0] || '',
            id: splits[1] || ''
        };
    });
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.status.data
 * @inner
 * @param {external:ElementFinder} elem A single cell's ElementFinder within the table column
 * @returns {String} The value of the tooltip attribute for a status column
 */
function rxColumnStatusData(elem) {
    return elem.element(by.xpath('./span')).getAttribute('tooltip');
}

/**
 * @function
 * @alias rxTableColumn.columnTypes.actionCog.data
 * @inner
 * @returns {String} An empty string (cog columns have no data)
 */
function rxCogData() {
    return '';
}

/**
 * @namespace rxTableColumn
 */
var rxTableColumn = {
    /**
     * @instance
     * @description The configuration object that the column was built with.
     * @type {rxTable.tableConfig}
     */
    config: {
        get: function () {
            return this.rxTable.config.columns[this.columnIndex];
        }
    },

    /**
     * @instance
     * @description The root &lt;th&gt; ElementFinder for this table column.
     * @type {external:ElementFinder}
     */
    rootElement: {
        get: function () {
            return this.rxTable.columnElements.get(this.columnIndex);
        }
    },

    /**
     * @instance
     * @description A promise to the header text for the column.
     * @type {String}
     */
    header: {
        get: function () {
            return this.rxTable.headerElements.get(this.columnIndex).getText();
        }
    },

    /**
     * @instance
     * @description An array of the WebeElement objects for the column's cells.
     * @type {external:ElementArrayFinder}
     */
    cells: {
        get: function () {
            return this.rxTable.rowElements.$$('td:nth-of-type(' +
                (this.columnIndex + 1) + ')');
        }
    },

    /**
     * @function
     * @instance
     * @param {Integer} rowNumber The zero-index of a row in the table.
     * @returns {rxTableRow} The rxTableRow page object for the row (see rxTableRow).
     */
    cell: {
        value: function (rowNumber) {
            return this.rxTable.rowElements.get(rowNumber).$('td:nth-of-type(' +
                (this.columnIndex + 1) + ')');
        }
    },

    /**
     * @instance
     * @description <p>A promise to an array of the data in the column's cells.</p>
     *   <p>The data will be transformed by the data method for the
     *   {@link rxTableColumn.columnType} specified in the configuration for the column.</p>
     * @type {Mixed}
     */
    data: {
        get: function () {
            var dataFn = this.config.type.data;
            if (this.rxTableRow) {
                return dataFn(this.cell(this.rxTableRow.rowIndex));
            } else {
                return this.cells.map(dataFn);
            }
        }
    },

    /**
     * @instance
     * @description The rxSortableColumn page object for the column.
     * @type {external:rxSortableColumn}
     */
    sortableColumn: {
        get: function () {
            var elem = this.rootElement.$('rx-sortable-column');
            return encore.rxSortableColumn.initialize(elem, this.rxTable.config.repeaterString);
        }
    },

    /**
     * @function
     * @instance
     * @returns {Boolean} Whether or not the column is present in the table, searches by label, not index!
     */
    isPresent: {
        value: function () {
            return this.rootElement.xpath('.//*[text()[contains(.,' + this.config.label + ')]]').isPresent();
        }
    },

    /**
     * @instance
     * @description Web element for any links if present.
     * @type {external:ElementArrayFinder[]}
     */
    links: {
        get: function () {
            if (this.rxTableRow) {
                return this.cell(this.rxTableRow.rowIndex).$$('a');
            } else {
                return this.cells.map(function (cell) {
                    return cell.$$('a');
                });
            }
        }
    }
};

/**
 * @function
 * @memberof rxTableColumn
 * @alias rxTableColumn.initialize
 * @param {rxTable} rxTable Parent rxTable page object for the column.
 * @param {Integer} columnIndex The zero-index of a column in the table.
 * @param {rxTableRow} [rxTableRow] The optional rxTableRow page object for the column.
 * @returns {rxTableColumn} Page object representing the indicated column for the parent rxTable.
 */
function rxTableColumnInitialize(rxTable, columnIndex, rxTableRow) {
    var tableColumn = {
        /**
         * @instance
         * @memberof rxTableColumn
         * @description The {@link rxTable} object that the row was built with.
         * @type {rxTable}
         */
        rxTable: {
            get: function () { return rxTable; }
        },

        /**
         * @instance
         * @description The column index that the column was built with.
         * @memberof rxTableColumn
         * @type {Integer}
         */
        columnIndex: {
            get: function () { return columnIndex; }
        },

        /**
         * @instance
         * @description The rxTableRow object that the row was built with.
         * @memberof rxTableColumn
         * @type {rxTableRow}
         */
        rxTableRow: {
            get: function () { return rxTableRow; }
        }
    };

    var extend = rxTable.config.columns[columnIndex].extend;
    var extendColumn = rxTable.config.extendColumn;
    return Page.create(_.merge(tableColumn, rxTableColumn, extend, extendColumn));
}

/**
 * @function
 * @memberof rxTableColumn
 * @alias rxTableColumn.initializeByRow
 * @param {Object} rxTableRow Parent rxRow page object for the column.
 * @param {Integer} columnIndex The zero-index of a column in the row.
 * @returns {rxTableColumn} Page object representing the indicated column for the parent rxRow.
 */
function rxTableColumnInitializeByRow(rxTableRow, columnIndex) {
    return rxTableColumnInitialize(rxTableRow.rxTable, columnIndex, rxTableRow);
}

/**
 * @typedef columnType
 * @memberof rxTableColumn
 * @type {Object}
 * @property {Function} data - Data transformation function to be applied to the element.
 *   Should return a promise to a native Object or primitive.
 * @property {Function} sort - Sort transformation function to be applied to the element.
 *   Must return a consistent primitive that will be sorted using the javascript sort method.
 */

/**
 * @typedef columnTypes
 * @memberof rxTableColumn
 * @type {Object}
 * @description
 *   <p>All default column types available in {@link rxTableColumn}.</p>
 *   <p>The format for the date column type in particular comes from the Encore UI Framework.<br/>See
 *   {@link http://rackerlabs.github.io/encore-ui/#/styles/formatting|Styleguide > Formatting}.
 * @property {rxTableColumn.columnType} checkbox - Transformation functions for a Checkbox column
 * @property {rxTableColumn.columnType} date - Transformation functions for a Date column
 * @property {rxTableColumn.columnType} relativeDate - Transformation functions for a Relative Date column
 * @property {rxTableColumn.columnType} string - Transformation functions for a String column
 * @property {rxTableColumn.columnType} ipAddress - Transformation functions for an IP Address column
 * @property {rxTableColumn.columnType} nameId - Transformation functions for a Name/ID column
 * @property {rxTableColumn.columnType} status - Transformation functions for a Status column
 * @property {rxTableColumn.columnType} number - Transformation functions for a Number column
 * @property {rxTableColumn.columnType} bytes - Transformation functions for a Bytes column
 * @property {rxTableColumn.columnType} actionCog - Transformation functions for a Action Cog column
 */

module.exports = {
    initialize: rxTableColumnInitialize,
    initializeByRow: rxTableColumnInitializeByRow,
    columnTypes: {
        checkbox: { data: rxColumnCheckboxData },
        date: { data: rxColumnDateData, sort: rxColumnDateSort },
        relativeDate: { data: rxColumnRelativeDateData, sort: rxColumnRelativeDateSort },
        string: { data: rxColumnStringData, sort: rxColumnStringSort },
        ipAddress: { data: rxColumnIpData, sort: rxColumnIpSort },
        nameId: { data: rxColumnNameIdData, sort: rxColumnStringSort },
        status: { data: rxColumnStatusData },
        number: { data: rxColumnStringData, sort: rxColumnNumberSort },
        bytes: { data: rxColumnStringData, sort: rxColumnBytesSort },
        actionCog: { data: rxCogData }
    }
};
