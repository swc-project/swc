//// [mergedInterfacesWithInheritedPrivates2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(C);
var E = /*#__PURE__*/ function(C2) {
    "use strict";
    _inherits(E, C2);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    return E;
}(C2);
var a;
var r = a.x; // error
var r2 = a.w; // error
