function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
export function bounceAndTakeIfA(value) {
    return "A" === value && takeA(value), value;
}
var EventEmitter = function() {
    "use strict";
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);
    }
    return _createClass(EventEmitter, [
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
        _classCallCheck(this, TableBaseEnum);
    }
    return _createClass(TableBaseEnum, [
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
        _classCallCheck(this, SqlTable);
    }
    return _createClass(SqlTable, [
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
