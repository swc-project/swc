//// [es6modulekindWithES5Target.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var __ = new WeakMap(), __1 = new WeakMap();
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.method = function method() {};
    return C;
}();
export { C as C2 };
export var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
        this.p = 1;
    }
    var _proto = D.prototype;
    _proto.method = function method() {};
    return D;
}();
__1.set(D, {
    writable: true,
    value: D.s = 0
});
D = _ts_decorate([
    foo
], D);
export { D as D2 };
var E = function E() {
    "use strict";
    _class_call_check(this, E);
};
export { E };
