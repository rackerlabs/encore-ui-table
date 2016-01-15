var moment = require('moment');
// The date format comes from the Encore UI framework, see:
// http://rackerlabs.github.io/encore-ui/#/styleguide/basics#date-formatting
var dateFormat = 'MMM D, YYYY @ HH:mm (UTCZZ)';

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {Boolean} Whether or not the checkbox in the cell is checked/selected
 * @example rxColumnCheckboxData(elem) => false
 */
function rxColumnCheckboxData(elem) {
    return elem.$('input').isSelected();
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {String} The Encore standard UTC date string for Encore standard date value of the cell
 */
function rxColumnDateData(elem) {
    return elem.getText().then(function (text) {
        return moment(text.trim(), dateFormat).utc().format(dateFormat);
    });
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
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
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {String} The Encore standard UTC date string for Encore standard relative date value of the cell
 */
function rxColumnRelativeDateData(elem) {
    return elem.element(by.xpath('ancestor-or-self::td/time')).getAttribute('datetime').then(function (text) {
        return moment(text, dateFormat).utc().format(dateFormat);
    });
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {Number} The seconds since Epoch for the Encore standard relative date value of the cell
 */
function rxColumnRelativeDateSort(elem) {
    return elem.element(by.xpath('ancestor-or-self::td/time')).getAttribute('datetime').then(function (text) {
        return moment(text, dateFormat).unix();
    });
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {String} The string value of the cell's data
 */
function rxColumnStringData(elem) {
    return elem.getText().then(function (text) {
        return text.trim();
    });
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
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
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {Number} The integer or float value from the table cell 'data-bytes' attribute
 */
function rxColumnBytesSort(elem) {
    return elem.element(by.xpath('ancestor-or-self::td')).getAttribute('data-bytes').then(function (text) {
        return parseFloat(text.trim());
    });
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {Number} The integer or float value from the table cell, postive or negative
 */
function rxColumnNumberSort(elem) {
    return elem.getText().then(function (text) {
        return parseFloat(text.trim());
    });
}

/**
 * @function
 * @param {Object} elem A single cell's ElementFinder within the table column
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
 * @param {Object} elem A single cell's ElementFinder within the table column
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
 * @param {Object} elem A single cell's ElementFinder within the table column
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
 * @param {Object} elem A single cell's ElementFinder within the table column
 * @returns {String} The value of the tooltip attribute for a status column
 */
function rxColumnStatusData(elem) {
    return elem.element(by.xpath('./span')).getAttribute('tooltip');
}

/**
 * @function
 * @returns {String} An empty string (cog columns have no data)
 */
function rxCogData() {
    return '';
}

var rxTableColumn = {
    /**
     * @function
     * @returns {Object} The configuration object that the column was built with.
     */
    config: {
        get: function () {
            return this.rxTable.config.columns[this.columnIndex];
        }
    },

    /**
     * @function
     * @returns {ElementFinder} The root <th> ElementFinder for this table column
     */
    rootElement: {
        get: function () {
            return this.rxTable.columnElements.get(this.columnIndex);
        }
    },

    /**
     * @returns {String} The header text for the column.
     */
    header: {
        get: function () {
            return this.rxTable.headerElements.get(this.columnIndex).getText();
        }
    },

    /**
     * @returns {ElementFinderArray} An array of the WebeElement objects for the column's cells.
     */
    cells: {
        get: function () {
            return this.rxTable.rowElements.$$('td:nth-of-type(' +
                (this.columnIndex + 1) + ')');
        }
    },

    /**
     * @function
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
     * @returns {Mixed} An array of the data in the column's cells.
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
     * @returns {rxSortableColumn} The rxSortableColumn page object for the column (see encore.rxSortableColumn)
     */
    sortableColumn: {
        get: function () {
            var elem = this.rootElement.$('rx-sortable-column');
            return encore.rxSortableColumn.initialize(elem, this.rxTable.config.repeaterString);
        }
    },

    /**
     * @function
     * @returns {Boolean} Whether or not the column is present in the table, searches by label, not index!
     */
    isPresent: {
        value: function () {
            return this.rootElement.xpath('.//*[text()[contains(.,' + this.config.label + ')]]').isPresent();
        }
    },

    /**
     * @returns {Object[]} Web element for any links if present
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
 * @param {rxTable} rxTable Parent rxTable page object for the column.
 * @param {Integer} columnIndex The zero-index of a column in the table.
 * @param {rxTableRow} [rxTableRow] The optional rxTableRow page object for the column.
 * @returns {rxTableRow} Page object representing the indicated column for the parent rxTable.
 */
function rxTableColumnInitialize(rxTable, columnIndex, rxTableRow) {
    var tableColumn = {
        /**
         * @function
         * @returns {rxTable} The rxTable object that the row was built with.
         */
        rxTable: {
            get: function () { return rxTable; }
        },

        /**
         * @function
         * @returns {Integer} The column index that the column was built with.
         */
        columnIndex: {
            get: function () { return columnIndex; }
        },

        /**
         * @function
         * @returns {rxTableRow} The rxTableRow object that the row was built with.
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
 * @param {Object} rxTableRow Parent rxRow page object for the column.
 * @param {Integer} columnIndex The zero-index of a column in the row.
 * @returns {rxTableRow} Page object representing the indicated column for the parent rxRow.
 */
function rxTableColumnInitializeByRow(rxTableRow, columnIndex) {
    return rxTableColumnInitialize(rxTableRow.rxTable, columnIndex, rxTableRow);
}

/**
 * @exports rxTableColumn
 */
module.exports = {
    initialize: rxTableColumnInitialize,
    initializeByRow: rxTableColumnInitializeByRow,
    types: {
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
