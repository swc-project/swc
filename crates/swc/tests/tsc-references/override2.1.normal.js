//// [override2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var AB = function AB() {
    "use strict";
    _class_call_check(this, AB);
};
var AD1 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(AD1, AB);
    function AD1() {
        _class_call_check(this, AD1);
        return _call_super(this, AD1, arguments);
    }
    return AD1;
}(AB);
var AD2 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(AD2, AB);
    function AD2() {
        _class_call_check(this, AD2);
        return _call_super(this, AD2, arguments);
    }
    return AD2;
}(AB);
var AD3 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(AD3, AB);
    function AD3() {
        _class_call_check(this, AD3);
        return _call_super(this, AD3, arguments);
    }
    var _proto = AD3.prototype;
    _proto.foo = function foo(v) {} // need override?
    ;
    _proto.baz = function baz() {};
    return AD3;
}(AB);
var D4 = /*#__PURE__*/ function(AB) {
    "use strict";
    _inherits(D4, AB);
    function D4() {
        _class_call_check(this, D4);
        return _call_super(this, D4, arguments);
    }
    var _proto = D4.prototype;
    _proto.foo = function foo(v) {};
    _proto.bar = function bar(v) {};
    _proto.baz = function baz() {};
    return D4;
}(AB);
