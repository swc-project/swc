import * as swcHelpers from "@swc/helpers";
export function bounceAndTakeIfA(value) {
    return "A" === value && takeA(value), value;
}
var EventEmitter = function() {
    "use strict";
    function EventEmitter() {
        swcHelpers.classCallCheck(this, EventEmitter);
    }
    return swcHelpers.createClass(EventEmitter, [
        {
            key: "off",
            value: function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            }
        }
    ]), EventEmitter;
}(), TableBaseEnum = function() {
    "use strict";
    function TableBaseEnum() {
        swcHelpers.classCallCheck(this, TableBaseEnum);
    }
    return swcHelpers.createClass(TableBaseEnum, [
        {
            key: "m",
            value: function() {
                null[null], null[null], null[null], null[null];
            }
        }
    ]), TableBaseEnum;
}(), SqlTable = function() {
    "use strict";
    function SqlTable() {
        swcHelpers.classCallCheck(this, SqlTable);
    }
    return swcHelpers.createClass(SqlTable, [
        {
            key: "validateRow",
            value: function(_row) {}
        },
        {
            key: "insertRow",
            value: function(row) {
                this.validateRow(row);
            }
        }
    ]), SqlTable;
}();
