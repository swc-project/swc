//// [stringIndexerConstrainsPropertyDeclarations.ts]
// String indexer types constrain the types of named properties in their containing type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return '';
    };
    C.foo = function foo() {} // ok
    ;
    _create_class(C, [
        {
            key: "X",
            get: function get() {
                return '';
            },
            set: function set(v1) {} // ok
        }
    ], [
        {
            key: "X",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
var a;
// error
var b = {
    a: '',
    b: 1,
    c: function() {},
    "d": '',
    "e": 1,
    1.0: '',
    2.0: 1,
    "3.0": '',
    "4.0": 1,
    f: null,
    get X () {
        return '';
    },
    set X (v){},
    foo: function foo() {
        return '';
    }
};
