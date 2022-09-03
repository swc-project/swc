//// [bug25127.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Entry = function() {
    "use strict";
    function Entry() {
        _class_call_check(this, Entry), this.c = 1;
    }
    return Entry.prototype.isInit = function(x) {
        return !0;
    }, Entry;
}(), Group = function() {
    "use strict";
    function Group() {
        _class_call_check(this, Group), this.d = "no";
    }
    return Group.prototype.isInit = function(x) {
        return !1;
    }, Group;
}();
function f(chunk) {
    return chunk.isInit(chunk) ? chunk.c : chunk.d;
}
function isBoolean(value) {
    return "boolean" == typeof value;
}
function foo(val) {
    isBoolean(val);
}
function isNumber(x) {
    return "number" == typeof x;
}
function g(x) {
    isNumber(x);
}
