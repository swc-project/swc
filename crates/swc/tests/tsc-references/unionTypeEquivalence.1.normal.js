//// [unionTypeEquivalence.ts]
// A | B is equivalent to A if B is a subtype of A
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {};
    return D;
}(C);
var x;
var x;
// A | B is equivalent to B | A.
var y;
var y;
// AB | C is equivalent to A | BC, where AB is A | B and BC is B | C.
var z;
var z;
var z;
var AB;
var BC;
var z1;
var z1;
