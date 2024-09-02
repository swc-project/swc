//// [unionTypesAssignability.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var unionNumberString;
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
    _proto.foo1 = function foo1() {};
    return D;
}(C);
var E = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(E, C);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    var _proto = E.prototype;
    _proto.foo2 = function foo2() {};
    return E;
}(C);
var unionDE;
var num;
var str;
var c;
var d;
var e;
// A union type U is assignable to a type T if each type in U is assignable to T
c = d;
c = e;
c = unionDE; // ok
d = d;
d = e;
d = unionDE; // error e is not assignable to d
e = d;
e = e;
e = unionDE; // error d is not assignable to e
num = num;
num = str;
num = unionNumberString; // error string is not assignable to number
str = num;
str = str;
str = unionNumberString; // error since number is not assignable to string
// A type T is assignable to a union type U if T is assignable to any type in U
d = c;
e = c;
unionDE = c; // error since C is not assinable to either D or E
d = d;
e = d;
unionDE = d; // ok
d = e;
e = e;
unionDE = e; // ok
num = num;
str = num;
unionNumberString = num; // ok 
num = str;
str = str;
unionNumberString = str; // ok
// Any
var anyVar;
anyVar = unionDE;
anyVar = unionNumberString;
unionDE = anyVar;
unionNumberString = anyVar;
// null
unionDE = null;
unionNumberString = null;
// undefined
unionDE = undefined;
unionNumberString = undefined;
// type parameters
function foo(t, u) {
    t = u; // error
    u = t; // error
    var x;
    x = t; // ok
    x = u; // ok
    x = undefined;
    t = x; // error U not assignable to T
    u = x; // error T not assignable to U
}
