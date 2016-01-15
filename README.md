## Encore UI Table Objects (encore-rx-table)
Temporary repository for Encore rxTable page objects.

## Usage
`npm install rx-table`

## Documentation
### rxTable: [docs/rxTable.html](http://rackerlabs.github.io/encore-ui-table/docs/rxTable.html)
The base page object for the table.  This is the object you'll instantiate in your own page objects via `rxTable.initialize(element, config)`.

### rxTableRow: [docs/rxTableRow.html](http://rackerlabs.github.io/encore-ui-table/docs/rxTableRow.html)
The page object for a table row.  You'll retrieve this by using the `row(index)` function after instantiating a table object above.

### rxTableColumn: [docs/rxTableColumn.html](http://rackerlabs.github.io/encore-ui-table/docs/rxTableColumn.html)
The page object for a column in the table or table row.  You'll access this using the `column(index)` function on a table or row object.  Alternatively, columns are also indexed by their name on the table or row objects.

When used in the context of a row object, the column object will only refer to the cell for that particular column in that particular row.  When used in the context of a table object, the column object will reference the entire column.  In most cases, this distinction is trivial, and the column generally works the way you would expect it to for the table or row object you're referencing.
