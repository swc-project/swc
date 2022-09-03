//// [numericIndexerConstrainsPropertyDeclarations.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var a, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        return "";
    }, C.foo = function() {}, _create_class(C, [
        {
            key: "X",
            get: function() {
                return "";
            },
            set: function(v1) {}
        }
    ], [
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), b = {
    a: "",
    b: 1,
    c: function() {},
    d: "",
    e: 1,
    1.0: "",
    2.0: 1,
    "3.0": "",
    "4.0": 1,
    f: null,
    get X () {
        return "";
    },
    set X (v){},
    foo: function() {
        return "";
    }
};
