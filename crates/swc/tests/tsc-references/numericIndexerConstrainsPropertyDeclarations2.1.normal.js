//// [numericIndexerConstrainsPropertyDeclarations2.ts]
// String indexer providing a constraint of a user defined type
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {
        return '';
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    var _proto = B.prototype;
    _proto.bar = function bar() {
        return '';
    };
    return B;
}(A);
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var a;
// error
var b = {
    1.0: new A(),
    2.0: new B(),
    "2.5": new B(),
    3.0: 1,
    "4.0": ''
};
