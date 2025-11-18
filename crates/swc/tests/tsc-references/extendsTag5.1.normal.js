//// [/a.js]
/**
 * @typedef {{
*     a: number | string;
*     b: boolean | string[];
* }} Foo
*/ /**
* @template {Foo} T
*/ import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
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
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(A);
/**
 * @extends {A<{a: string, b: string[]}>}
 */ var D = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(D, A);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(A);
/**
 * @extends {A<{a: string, b: string}>}
 */ var E = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(E, A);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    return E;
}(A);
