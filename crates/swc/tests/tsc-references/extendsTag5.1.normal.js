//// [/a.js]
/**
 * @typedef {{
*     a: number | string;
*     b: boolean | string[];
* }} Foo
*/ /**
* @template {Foo} T
*/ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var A = function A(a) {
    "use strict";
    _class_call_check(this, A);
    return a;
};
/**
* @extends {A<{
*     a: string,
*     b: string[]
* }>}
*/ var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
/**
 * @extends {A<{
 *     a: string,
 *     b: string
 * }>}
 */ var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(A);
/**
 * @extends {A<{a: string, b: string[]}>}
 */ var D = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(D, A);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(A);
/**
 * @extends {A<{a: string, b: string}>}
 */ var E = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(E, A);
    var _super = _create_super(E);
    function E() {
        _class_call_check(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(A);
