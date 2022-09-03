//// [controlFlowGenericTypes.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1(x, y, z) {
    return x ? (x.length, x) : y.a ? (y.a.length, y.a) : z[0] ? (z[0].length, z[0]) : "hello";
}
function f2(x) {
    return x ? (x.length, x) : "hello";
}
function g1(x) {
    isBox(x) && unbox(x);
}
function g2(x) {
    isUndefined(x) || unbox(x);
}
function g3(x) {
    isBox(x) || unbox(x);
}
function g4(x) {
    isUndefined(x) && unbox(x);
}
export function bounceAndTakeIfA(value) {
    return "A" === value && takeA(value), value;
}
var fn = function(value) {
    value.foo, "foo" in value && value.foo, "B" === value.tag && value.foo;
}, fn2 = function(value) {
    value.foo, "foo" in value && value.foo, "B" === value.tag && value.foo;
};
function notWorking(object) {
    object.testable && object.doTest();
}
function get(key, obj) {
    var value = obj[key];
    return null !== value ? value : 0;
}
var EventEmitter = function() {
    "use strict";
    function EventEmitter() {
        _class_call_check(this, EventEmitter);
    }
    return EventEmitter.prototype.off = function() {
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    }, EventEmitter;
}();
function once(emittingObject, eventName) {
    emittingObject.off(eventName, 0), emittingObject.off(eventName, 0);
}
function fx1(obj, key) {
    obj[key], obj && obj[key];
}
function fx2(obj, key) {
    obj[key], obj && obj[key];
}
function fx3(obj, key) {
    obj[key], obj && obj[key];
}
var TableBaseEnum = function() {
    "use strict";
    function TableBaseEnum() {
        _class_call_check(this, TableBaseEnum);
    }
    return TableBaseEnum.prototype.m = function() {
        null[null], null[null], null[null], null[null];
    }, TableBaseEnum;
}();
function f10(x, y) {}
var SqlTable = function() {
    "use strict";
    function SqlTable() {
        _class_call_check(this, SqlTable);
    }
    var _proto = SqlTable.prototype;
    return _proto.validateRow = function(_row) {}, _proto.insertRow = function(row) {
        this.validateRow(row);
    }, SqlTable;
}();
function update(control, key, value) {
    void 0 !== control && (control[key] = value);
}
