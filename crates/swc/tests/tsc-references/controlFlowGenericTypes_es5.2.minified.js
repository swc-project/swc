import * as swcHelpers from "@swc/helpers";
export function bounceAndTakeIfA(value) {
    return 'A' === value && takeA(value), value;
}
var EventEmitter = function() {
    "use strict";
    function EventEmitter() {
        swcHelpers.classCallCheck(this, EventEmitter);
    }
    return EventEmitter.prototype.off = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    }, EventEmitter;
}(), TableBaseEnum = function() {
    "use strict";
    function TableBaseEnum() {
        swcHelpers.classCallCheck(this, TableBaseEnum);
    }
    return TableBaseEnum.prototype.m = function() {
        null[null], null[null], null[null], null[null];
    }, TableBaseEnum;
}(), SqlTable = function() {
    "use strict";
    function SqlTable() {
        swcHelpers.classCallCheck(this, SqlTable);
    }
    var _proto = SqlTable.prototype;
    return _proto.validateRow = function(_row) {}, _proto.insertRow = function(row) {
        this.validateRow(row);
    }, SqlTable;
}();
